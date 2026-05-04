import { invoke } from '@tauri-apps/api/core';
import {
	createTree,
	syncDataLoaderFeature,
	selectionFeature,
	hotkeysCoreFeature,
	type TreeInstance,
	type ItemInstance,
	type MainFeatureDef,
	type SelectionFeatureDef,
	type SyncDataLoaderFeatureDef,
	type TreeFeatureDef
} from '@headless-tree/core';
import { adaptReactProps } from '$lib/utils/adaptReactProps';

export type FileNode = {
	path: string;
	name: string;
	isFolder: boolean;
};

// Headless Tree features
type TreeState = MainFeatureDef<FileNode>['state'] &
	TreeFeatureDef<FileNode>['state'] &
	SelectionFeatureDef<FileNode>['state'] &
	SyncDataLoaderFeatureDef<FileNode>['state'];

// Fields that should be accessible via treeRow.<member>
const baseFields = (instance: ItemInstance<FileNode>) => ({
	id: instance.getId(),
	name: instance.getItemName(),
	level: instance.getItemMeta().level,
	props: adaptReactProps(instance.getProps()),
	instance
});

const treeFeatureFields = (instance: ItemInstance<FileNode>) => ({
	isFolder: instance.isFolder(),
	isExpanded: instance.isExpanded(),
	isFocused: instance.isFocused()
});

const selectionFeatureFields = (instance: ItemInstance<FileNode>) => ({
	isSelected: instance.isSelected()
});

const buildTreeRow = (instance: ItemInstance<FileNode>) => ({
	...baseFields(instance),
	...treeFeatureFields(instance),
	...selectionFeatureFields(instance)
});

export type TreeRow = ReturnType<typeof buildTreeRow>;

// Set up initial state for features
const initialTreeState = (): TreeState => ({
	expandedItems: [],
	selectedItems: [],
	focusedItem: null
});

class FileTreeStore {
	treeState = $state<TreeState>(initialTreeState()); // State that we feed into Headless Tree
	tree = $state<TreeInstance<FileNode> | null>(null); // Headless Tree's tree instance, used to tell if tree is loaded or not
	#nodeByPath = $state<Record<string, FileNode>>({}); // Flat list of FileNodes by path
	#childrenByPath = $state<Record<string, string[]>>({}); // Flat list of child paths by path
	#revision = $state(0); // Incremented on every state mutation to ensure proper rebuilding of the tree

	// Raw item instance list, for debugging
	treeItems = $derived.by<ItemInstance<FileNode>[]>(() => {
		void this.#revision;
		return this.tree?.getItems() ?? [];
	});

	treeRows = $derived.by<TreeRow[]>(() => this.treeItems.map(buildTreeRow));

	initialize = async (rootPath: string) => {
		this.reset();

		const root = await invoke<FileNode>('get_file_node', { path: rootPath });
		this.#nodeByPath[rootPath] = root;
		await this.#loadChildren(rootPath);

		this.tree = createTree<FileNode>({
			rootItemId: rootPath,
			getItemName: (item) => item.getItemData().name,
			isItemFolder: (item) => item.getItemData().isFolder,
			dataLoader: {
				getItem: (itemId) => this.#nodeByPath[itemId],
				getChildren: (itemId) => this.#childrenByPath[itemId] ?? []
			},
			state: this.treeState,
			setState: this.#applyStateUpdate,
			features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
		});

		this.tree.setMounted(true);
		this.tree.rebuildTree();

		this.#revision++;
	};

	reset = () => {
		this.tree?.setMounted(false);
		this.#nodeByPath = {};
		this.#childrenByPath = {};
		this.treeState = initialTreeState();
		this.tree = null;
		this.#revision++;
	};

	// TODO: Implement
	rename = async (oldPath: string, newName: string) => {
		// Tauri returns OS-native paths, backslash means Windows
		const sep = oldPath.includes('\\') ? '\\' : '/';
		const parentPath = oldPath.slice(0, oldPath.lastIndexOf(sep));
		const newPath = `${parentPath}${sep}${newName}`;

		await invoke('rename_file_node', { oldPath, newPath });

		// Refresh the parent so the rename shows up
		if (parentPath in this.#childrenByPath) {
			await this.#loadChildren(parentPath);
		}
	};

	#applyStateUpdate = (updater: Partial<TreeState> | ((prev: TreeState) => Partial<TreeState>)) => {
		const prev = $state.snapshot(this.treeState) as TreeState; // Save previous state to compare
		const partial = typeof updater === 'function' ? updater(prev) : updater;

		// Lazy load children for newly expanded folders
		if (partial.expandedItems) {
			const prevExpanded = new Set(prev.expandedItems);
			for (const id of partial.expandedItems) {
				if (!prevExpanded.has(id) && !(id in this.#childrenByPath)) {
					void this.#loadChildren(id);
				}
			}
		}

		// Merge state
		for (const key of Object.keys(partial) as (keyof TreeState)[]) {
			const value = partial[key];
			(this.treeState as Record<string, unknown>)[key] = Array.isArray(value) ? [...value] : value;
		}

		this.#revision++;
	};

	#loadChildren = async (path: string) => {
		try {
			const children = await invoke<FileNode[]>('get_file_node_children', { path });

			// Populate #nodeByPath with FileNodes first
			for (const child of children) {
				this.#nodeByPath[child.path] = child;
			}
			// Update #childrenByPath second
			this.#childrenByPath[path] = children.map((child) => child.path);

			this.tree?.rebuildTree();
			this.#revision++;
		} catch (err) {
			console.error('Failed to load children for', path, err);
		}
	};
}

export const fileTreeStore = new FileTreeStore();
