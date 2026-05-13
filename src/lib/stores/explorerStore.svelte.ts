// TODO: Make folders stay expanded when renamed

import { addToast } from '$lib/stores/toastStore.svelte';
import { invoke } from '@tauri-apps/api/core';
import { dirname, join, sep } from '@tauri-apps/api/path';
import { watch, type UnwatchFn, type WatchEvent } from '@tauri-apps/plugin-fs';
import { tick } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

type NormalizedWatchEvent =
	| { kind: 'create'; path: string; isDirectory: boolean }
	| { kind: 'remove'; path: string; isDirectory: boolean }
	| { kind: 'rename'; path: string; newPath: string }
	| { kind: 'other' };

class ExplorerStore {
	#unwatch?: UnwatchFn;
	#root = $state<ExplorerNode | undefined>();

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

	initialize = async (rootPath: string): Promise<void> => {
		this.reset();

		try {
			// Grab root data from rust
			const initialData = await invoke<ExplorerNodeInitialData>('get_explorer_node', { path: rootPath });

			// Create node and load root children
			this.#root = new ExplorerNode(initialData);
			await this.#loadChildren(this.#root);
			await tick();

			this.#expanded.add(rootPath);

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
			// TODO: OPEN FILE IN WORKSPACE AND SEND FOCUS
		}
	};

	expandFocused = (): void => {
		const current = this.visibleRows[this.#focusedIndex];
		if (current?.node.isDirectory && !this.isExpanded(current.node)) {
			this.expandToggle(current.node);
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
		console.log(this.#renaming !== undefined);
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
		console.log(newName);
		if (!newName || newName === node.name) {
			this.#renaming = undefined;
			return;
		}

		const oldPath = node.path;

		try {
			// Construct new path
			const parentPath = await dirname(node.path);
			const newPath = await join(parentPath, newName);

			console.log('Test');

			// Optimisitically update the tree
			this.#handleRename(oldPath, newPath);
			this.#renaming = undefined;

			console.log(node.path, newPath);

			await invoke('rename_explorer_node', { oldPath, newPath });

			console.log('Test3');
		} catch (err) {
			// Revert renaming in case of error
			this.#handleRename(node.path, oldPath);
			addToast(String(err), 'error');
		}
	};

	validateName = (name: string): string | undefined => {
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
		console.log(e);
		const event = this.#normalizeWatchEvent(e);
		switch (event.kind) {
			case 'create':
				//this.#handleCreate(event.path, event.isDirectory);
				break;
			case 'remove':
				//this.#handleRemove(event.path);
				break;
			case 'rename':
				console.log(e);
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

interface ExplorerNodeInitialData {
	path: string;
	name: string;
	isDirectory: boolean;
}

export type IExplorerNode = InstanceType<typeof ExplorerNode>;

class ExplorerNode {
	path = $state<string>('');
	name = $state<string>('');

	#isDirectory: boolean;
	#isDirectoryResolved: boolean = false;
	#parent: ExplorerNode | undefined;
	#children = new SvelteMap<string, ExplorerNode>();

	constructor(initialData: ExplorerNodeInitialData) {
		this.path = initialData.path;
		this.name = initialData.name;
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
		const newName = newPath.split(sep()).pop()!;

		this.#parent?.removeChild(this);
		this.path = newPath;
		this.name = newName;
		this.#parent?.addChild(this);
	};
}
