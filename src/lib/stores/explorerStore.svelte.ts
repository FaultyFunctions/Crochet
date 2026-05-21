// TODO: Make folders stay expanded when renamed

import { ProjectType } from '$lib/stores/projectStore.svelte';
import { addToast } from '$lib/stores/toastStore.svelte';
import { CommandHistory, type Command } from '$lib/utils/CommandHistory.svelte';
import { invoke } from '@tauri-apps/api/core';
import { dirname, join, sep } from '@tauri-apps/api/path';
import { watch, type UnwatchFn, type WatchEvent } from '@tauri-apps/plugin-fs';
import { tick } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

export type IExplorerNode = InstanceType<typeof ExplorerNode>;

type NormalizedWatchEvent =
	| { kind: 'create'; path: string; isDirectory: boolean }
	| { kind: 'remove'; path: string; isDirectory: boolean }
	| { kind: 'rename'; path: string; newPath: string }
	| { kind: 'other' };

interface ExplorerNodeInitialData {
	path: string;
	name: string;
	isDirectory: boolean;
}

class ExplorerStore {
	isActive = $state<boolean>(false);

	#unwatch?: UnwatchFn;
	#fileExtension?: string;
	#root = $state<ExplorerNode | undefined>();
	#history = new CommandHistory();

	visibleRows = $derived.by(() => {
		const rows: { node: ExplorerNode; depth: number }[] = [];
		const flatten = (node: ExplorerNode, depth: number) => {
			rows.push({ node, depth });

			// If node is expanded and has children loaded already
			if (this.#expanded.has(node.path) && node.isDirectoryResolved) {
				for (const child of this.#sortNodes([...node.children.values()])) {
					flatten(child, depth + 1);
				}
			}
		};

		if (this.#root) {
			for (const child of this.#sortNodes([...this.#root.children.values()])) {
				flatten(child, 0);
			}
		}

		return rows;
	});

	#expanded = new SvelteSet<string>();
	#selected = new SvelteSet<string>();
	#lastSelected = $state<string | undefined>();
	#focused = $state<string | undefined>();
	#focusedIndex = $derived(this.visibleRows.findIndex((row) => row.node.path === this.#focused));
	#renaming = $state<string | undefined>();

	selectedCount = $derived(this.#selected.size);

	undo = this.#history.undo;
	redo = this.#history.redo;

	get fileExtension() {
		return this.#fileExtension!;
	}

	get canUndo() {
		return this.#history.canUndo;
	}

	get canRedo() {
		return this.#history.canRedo;
	}

	get focusedID(): string | undefined {
		return this.#focused;
	}

	initialize = async (rootPath: string, projectType: ProjectType): Promise<void> => {
		this.reset();
		this.#fileExtension = projectType === ProjectType.CHATTERBOX ? '.chatter' : '.yarn';

		try {
			// Grab root data from rust
			const initialData = await invoke<ExplorerNodeInitialData>('get_explorer_node', { path: rootPath });

			// Create node and load root children
			this.#root = new ExplorerNode(initialData);
			await this.#loadChildren(this.#root);
			// await tick();

			this.#unwatch = await watch(rootPath, this.#handleWatcherEvents, {
				recursive: true
			});
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	isSelected = (node: ExplorerNode): boolean => {
		return this.#selected.has(node.path);
	};

	select = (node: ExplorerNode, ctrl: boolean = false, shift: boolean = false): void => {
		if (shift && this.#lastSelected) {
			const rows = this.visibleRows;
			const lastIndex = rows.findIndex((row) => row.node.path === this.#lastSelected);
			const currentIndex = rows.findIndex((row) => row.node.path === node.path);
			const start = Math.min(lastIndex, currentIndex);
			const end = Math.max(lastIndex, currentIndex);

			for (let i = start; i <= end; i++) {
				this.#selected.add(rows[i].node.path);
			}
		} else if (ctrl) {
			if (this.#selected.has(node.path)) {
				this.#selected.delete(node.path);
			} else {
				this.#selected.add(node.path);
			}
			this.#lastSelected = node.path;
		} else {
			this.#selected.clear();
			this.#selected.add(node.path);
			this.#lastSelected = node.path;
		}

		this.#focused = node.path;
	};

	clearSelection = (): void => {
		this.#selected.clear();
	};

	isExpanded = (node: ExplorerNode): boolean => {
		return this.#expanded.has(node.path);
	};

	expandToggle = async (node: ExplorerNode): Promise<void> => {
		if (this.#expanded.has(node.path)) {
			this.#expanded.delete(node.path);
		} else {
			if (!node.isDirectoryResolved) {
				await this.#loadChildren(node);
				await tick();
			}
			this.#expanded.add(node.path);
		}
	};

	isFocused = (node: ExplorerNode): boolean => {
		return this.#focused === node.path;
	};

	focus = (node: ExplorerNode): void => {
		this.#focused = node.path;
	};

	focusNext = (): void => {
		const next = this.visibleRows[this.#focusedIndex + 1];
		if (next) this.focus(next.node);
	};

	focusPrev = (): void => {
		const prev = this.visibleRows[this.#focusedIndex - 1];
		if (prev) this.focus(prev.node);
	};

	activateFocused = (): void => {
		const current = this.visibleRows[this.#focusedIndex];
		if (!current) return;
		if (current.node.isDirectory) {
			this.expandToggle(current.node);
		} else {
			// TODO: OPEN FILE IN WORKSPACE
		}
	};

	expandFocused = (): void => {
		const current = this.visibleRows[this.#focusedIndex];
		if (current?.node.isDirectory) {
			if (this.isExpanded(current.node)) {
				const firstChild = current.node.children.values().next().value;
				if (firstChild) this.focus(firstChild);
			} else {
				this.expandToggle(current.node);
			}
		}
	};

	collapseFocused = (): void => {
		const current = this.visibleRows[this.#focusedIndex];
		if (current?.node.isDirectory && this.isExpanded(current.node)) {
			this.expandToggle(current.node);
		} else {
			// Send focus to parent folder
			if (current.node.parent?.path !== this.#root?.path && current.node.parent) {
				this.focus(current.node.parent);
			}
		}
	};

	focusFirst = (): void => {
		const first = this.visibleRows[0];
		if (first) this.focus(first.node);
	};

	focusLast = (): void => {
		const last = this.visibleRows[this.visibleRows.length - 1];
		if (last) this.focus(last.node);
	};

	clearFocus = (): void => {
		this.#focused = undefined;
	};

	isRenaming = (node: ExplorerNode): boolean => {
		return this.#renaming === node.path;
	};

	isAnyRenaming = (): boolean => {
		return this.#renaming !== undefined;
	};

	startRename = (): void => {
		const current = this.visibleRows[this.#focusedIndex];
		if (!current) return;
		this.#renaming = current.node.path;
	};

	cancelRename = (): void => {
		this.#renaming = undefined;
	};

	commitRename = async (node: ExplorerNode, newName: string): Promise<void> => {
		const finalName = node.isDirectory ? newName : newName.concat(this.fileExtension);
		const oldPath = node.path;

		try {
			// Construct new path
			const parentPath = await dirname(node.path);
			const newPath = await join(parentPath, finalName);

			await this.#history.execute(new RenameCommand(this.#handleRename.bind(this), oldPath, newPath));

			this.#renaming = undefined;
		} catch (err) {
			// Revert renaming in case of error
			this.#handleRename(node.path, oldPath);
			addToast(String(err), 'error');
		}
	};

	getNameError = (name: string): string | undefined => {
		if (!name || name.trim() === '') return 'Name cannot be empty';
		if (/[\\/:*?"<>|]/.test(name)) return 'Name contains invalid characters';
		if (/[. ]$/.test(name)) return 'Name cannot end with a space or period';
		if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(name)) return 'Name is reserved by Windows';
		return undefined;
	};

	reset = (): void => {
		this.#unwatch?.();
		this.#root = undefined;
	};

	#sortNodes = (nodes: ExplorerNode[]): ExplorerNode[] => {
		return nodes.sort((a, b) => {
			if (a.isDirectory && !b.isDirectory) return -1;
			if (!a.isDirectory && b.isDirectory) return 1;
			return a.name.localeCompare(b.name);
		});
	};

	#loadChildren = async (node: ExplorerNode): Promise<void> => {
		try {
			const childrenInitialData = await invoke<ExplorerNodeInitialData[]>('get_explorer_node_children', {
				path: node.path
			});

			for (const childInitialData of childrenInitialData) {
				node.addChild(new ExplorerNode(childInitialData));
			}

			node.markDirectoryResolved();
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	#normalizeWatchEvent = (e: WatchEvent): NormalizedWatchEvent => {
		const type = e.type;

		if (typeof type === 'string') return { kind: 'other' };
		if ('create' in type) return { kind: 'create', path: e.paths[0], isDirectory: type.create.kind === 'folder' };
		if ('remove' in type) return { kind: 'remove', path: e.paths[0], isDirectory: type.remove.kind === 'folder' };
		if ('modify' in type && type.modify.kind === 'rename' && e.paths[1]) {
			return { kind: 'rename', path: e.paths[0], newPath: e.paths[1] };
		}

		return { kind: 'other' };
	};

	#handleWatcherEvents = (e: WatchEvent): void => {
		const event = this.#normalizeWatchEvent(e);
		switch (event.kind) {
			case 'create':
				//this.#handleCreate(event.path, event.isDirectory);
				break;
			case 'remove':
				//this.#handleRemove(event.path);
				break;
			case 'rename':
				this.#handleRename(event.path, event.newPath);
				break;
		}
	};

	#handleRename = (oldPath: string, newPath: string) => {
		const node = this.#findNodeByPath(oldPath);
		if (!node) return;

		node.rename(newPath);

		if (this.#focused === oldPath) this.#focused = newPath;
		if (this.#selected.has(oldPath)) {
			this.#selected.delete(oldPath);
			this.#selected.add(newPath);
		}
		if (this.#expanded.has(oldPath)) {
			this.expandToggle(node);
		}
	};

	#findNodeByPath = (path: string) => {
		const search = (node: ExplorerNode): ExplorerNode | undefined => {
			if (node.path === path) return node;

			for (const child of node.children.values()) {
				const found = search(child);
				if (found) return found;
			}

			return undefined;
		};

		return this.#root ? search(this.#root) : undefined;
	};
}

export const explorerStore = new ExplorerStore();

class ExplorerNode {
	path = $state<string>('');
	name = $state<string>('');

	#isDirectory: boolean;
	#isDirectoryResolved: boolean = false;
	#parent: ExplorerNode | undefined;
	#children = new SvelteMap<string, ExplorerNode>();

	constructor(initialData: ExplorerNodeInitialData) {
		this.path = initialData.path;
		this.name = initialData.name.split('.')[0];
		this.#isDirectory = initialData.isDirectory;
	}

	get isDirectory(): boolean {
		return this.#isDirectory;
	}

	get isDirectoryResolved(): boolean {
		return this.#isDirectoryResolved;
	}

	markDirectoryResolved = (): void => {
		this.#isDirectoryResolved = true;
	};

	get parent(): ExplorerNode | undefined {
		return this.#parent;
	}

	addChild = (child: ExplorerNode): void => {
		child.#parent = this;
		this.#children.set(child.name, child);
	};

	removeChild = (child: ExplorerNode): void => {
		this.#children.delete(child.name);
	};

	get children(): Map<string, ExplorerNode> {
		return this.#children;
	}

	get root(): ExplorerNode {
		if (!this.#parent) {
			return this;
		}

		return this.#parent.root;
	}

	get isRoot(): boolean {
		return this === this.root;
	}

	rename = (newPath: string): void => {
		const newName = newPath.split(sep()).pop()!.split('.')[0];

		this.#parent?.removeChild(this);
		this.path = newPath;
		this.name = newName;
		this.#parent?.addChild(this);
	};
}

class RenameCommand implements Command {
	#rename: (oldPath: string, newPath: string) => void;
	#oldPath: string;
	#newPath: string;

	constructor(rename: (oldPath: string, newPath: string) => void, oldPath: string, newPath: string) {
		this.#rename = rename;
		this.#oldPath = oldPath;
		this.#newPath = newPath;
	}

	execute = async (): Promise<void> => {
		await invoke('rename_explorer_node', { oldPath: this.#oldPath, newPath: this.#newPath });
		this.#rename(this.#oldPath, this.#newPath);
	};

	undo = async (): Promise<void> => {
		await invoke('rename_explorer_node', { oldPath: this.#newPath, newPath: this.#oldPath });
		this.#rename(this.#newPath, this.#oldPath);
	};

	redo = async (): Promise<void> => {
		await invoke('rename_explorer_node', { oldPath: this.#oldPath, newPath: this.#oldPath });
		this.#rename(this.#oldPath, this.#newPath);
	};
}
