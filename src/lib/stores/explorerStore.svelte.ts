import { addToast } from '$lib/stores/toastStore.svelte';
import { invoke } from '@tauri-apps/api/core';
import { watch, type UnwatchFn, type WatchEvent } from '@tauri-apps/plugin-fs';
import { tick } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

class ExplorerStore {
	#unwatch?: UnwatchFn;
	#root = $state<ExplorerNode | undefined>();

	#expanded = new SvelteSet<string>();
	#selected = new SvelteSet<string>();

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

		console.log(
			'visibleRows recomputed',
			rows.map((r) => r.node.name)
		);

		return rows;
	});

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

	select = (node: ExplorerNode) => {
		this.#selected.add(node.path);
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
