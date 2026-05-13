import { addToast } from '$lib/stores/toastStore.svelte';
import { invoke } from '@tauri-apps/api/core';
import { watch, type UnwatchFn, type WatchEvent } from '@tauri-apps/plugin-fs';
import { tick } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

class ExplorerStore {
	#unwatch?: UnwatchFn;
	#root = $state<ExplorerNode | undefined>();

	visibleRows = $derived.by(() => {
		const rows: { node: ExplorerNode; depth: number }[] = [];
		const flatten = (node: ExplorerNode, depth: number) => {
			rows.push({ node, depth });

			// If node is expanded and has children loaded already
			if (this.#expanded.has(node.path) && node.isDirectoryResolved) {
				for (const child of node.children.values()) {
					flatten(child, depth + 1);
				}
			}
		};

		if (this.#root) {
			// Skip root
			for (const child of this.#root.children.values()) {
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

	initialize = async (rootPath: string) => {
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

	isSelected = (node: ExplorerNode) => {
		return this.#selected.has(node.path);
	};

	select = (node: ExplorerNode, ctrl: boolean = false, shift: boolean = false) => {
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

	clearSelection = () => {
		this.#selected.clear();
	};

	isExpanded = (node: ExplorerNode) => {
		return this.#expanded.has(node.path);
	};

	expandToggle = async (node: ExplorerNode) => {
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

	isFocused = (node: ExplorerNode) => {
		return this.#focused === node.path;
	};

	focus = (node: ExplorerNode) => {
		this.#focused = node.path;
	};

	focusNext = () => {
		const next = this.visibleRows[this.#focusedIndex + 1];
		if (next) this.focus(next.node);
	};

	focusPrev = () => {
		const prev = this.visibleRows[this.#focusedIndex - 1];
		if (prev) this.focus(prev.node);
	};

	activateFocused = () => {
		const current = this.visibleRows[this.#focusedIndex];
		if (!current) return;
		if (current.node.isDirectory) {
			this.expandToggle(current.node);
		} else {
			// TODO: OPEN FILE IN WORKSPACE AND SEND FOCUS
		}
	};

	expandFocused = () => {
		const current = this.visibleRows[this.#focusedIndex];
		if (current?.node.isDirectory && !this.isExpanded(current.node)) {
			this.expandToggle(current.node);
		}
	};

	collapseFocused = () => {
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

	focusFirst = () => {
		const first = this.visibleRows[0];
		if (first) this.focus(first.node);
	};

	focusLast = () => {
		const last = this.visibleRows[this.visibleRows.length - 1];
		if (last) this.focus(last.node);
	};

	clearFocus = () => {
		this.#focused = undefined;
	};

	reset = () => {
		this.#unwatch?.();
		this.#root = undefined;
	};

	#loadChildren = async (node: ExplorerNode) => {
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

	#handleWatcherEvents = (e: WatchEvent) => {};
}

export const explorerStore = new ExplorerStore();

interface ExplorerNodeInitialData {
	path: string;
	name: string;
	isDirectory: boolean;
}

class ExplorerNode {
	path: string;
	name: string;

	#isDirectory: boolean;
	#isDirectoryResolved: boolean = false;
	#parent: ExplorerNode | undefined;
	#children = new Map<string, ExplorerNode>();

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

	markDirectoryResolved = () => {
		this.#isDirectoryResolved = true;
	};

	get parent(): ExplorerNode | undefined {
		return this.#parent;
	}

	addChild = (child: ExplorerNode) => {
		child.#parent = this;
		this.#children.set(child.name, child);
	};

	get children() {
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
}

class SelectionManager {}
