import { invoke } from '@tauri-apps/api/core';
import type { FileNode } from '$lib/types/fileTree';
import { addToast } from '$lib/stores/toastStore.svelte';
import { PROJECT_FILE_VERSION } from '$lib/constants';
import { z } from 'zod';
import { SvelteSet } from 'svelte/reactivity';

export enum ProjectState {
	LANDING_PAGE = 'LANDING_PAGE',
	PROJECT_OPEN = 'PROJECT_OPEN'
}

export enum ProjectType {
	YARNSPINNER = 'YARNSPINNER',
	CHATTERBOX = 'CHATTERBOX'
}

const InitialConfigSchema = z.object({
	name: z.string(),
	path: z.string(),
	projectType: z.enum(ProjectType)
});

type InitialConfig = z.infer<typeof InitialConfigSchema>;

const ProjectConfigSchema = InitialConfigSchema.extend({
	fileVersion: z.number()
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

// TODO: Convert Project Store to Class
class ProjectStore {
	// # State
	config = $state<ProjectConfig | null>(null);
	fileTree = $state<FileNode[]>([]);
	state = $state<ProjectState>(ProjectState.LANDING_PAGE);
	expandedFolders = new SvelteSet<string>();

	initialize = async (initialConfig: InitialConfig): Promise<void> => {
		const config = {
			fileVersion: PROJECT_FILE_VERSION,
			...initialConfig
		};

		try {
			await invoke('create_project_file', { name: config.name, path: config.path, config: config });
			const fileTree = await invoke<FileNode[]>('get_sorted_directory_contents', { path: config.path });

			// Update State
			this.config = config;
			this.fileTree = fileTree;
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	openProjectFile = async (): Promise<void> => {
		try {
			const data = await invoke<string | null>('open_project_file');
			if (data === null) return; // User Cancelled

			const config = ProjectConfigSchema.parse(JSON.parse(data));
			const fileTree = await invoke<FileNode[]>('get_sorted_directory_contents', { path: config.path });

			// Update State
			this.config = config;
			this.fileTree = fileTree;
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	// # FILE TREE FUNCTIONS

	loadChildren = async (node: FileNode): Promise<void> => {
		if (!node.isDir) return;

		console.log('[loadChildren] fetching', node.path);

		try {
			const kids = await invoke<FileNode[]>('get_sorted_directory_contents', { path: node.path });
			console.log(
				'[loadChildren] got',
				node.path,
				'→',
				kids.map((k) => k.name)
			);
			node.children = kids;
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	toggleFolder = async (node: FileNode, open: boolean): Promise<void> => {
		if (!node.isDir) return;

		if (open) {
			this.expandedFolders.add(node.path);
			await this.loadChildren(node);
		} else {
			this.expandedFolders.delete(node.path);
		}
	};

	moveNode = async (sourcePath: string, targetPath: string): Promise<void> => {
		try {
			await invoke('move_path', { sourcePath, targetPath });

			const sourceParent = this.#getParentPath(sourcePath);

			await this.#refreshFolder(targetPath);
			if (sourceParent !== targetPath) {
				await this.#refreshFolder(sourceParent);
			}

			// Auto-expand destination folder if not root
			if (targetPath !== this.config!.path) {
				const targetNode = this.#findNode(targetPath, this.fileTree);
				if (targetNode) {
					this.expandedFolders.add(targetPath);
				}
			}
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	#getParentPath = (path: string): string => {
		return path.replace(/[/\\][^/\\]+$/, '');
	};

	#refreshFolder = async (folderPath: string): Promise<void> => {
		const fresh = await invoke<FileNode[]>('get_sorted_directory_contents', {
			path: folderPath
		});

		const rootPath = this.config!.path;
		const current =
			folderPath === rootPath ? this.fileTree : (this.#findNode(folderPath, this.fileTree)?.children ?? null);

		const merged = this.#mergeChildren(current, fresh);

		if (folderPath === rootPath) {
			this.fileTree = merged;
		} else {
			const parent = this.#findNode(folderPath, this.fileTree);
			if (parent) parent.children = merged;
		}
	};

	#findNode = (targetPath: string, nodes: FileNode[]): FileNode | null => {
		for (const n of nodes) {
			if (n.path === targetPath) return n;
			if (n.children) {
				const found = this.#findNode(targetPath, n.children);
				if (found) return found;
			}
		}

		return null;
	};

	#mergeChildren = (existing: FileNode[] | null, fresh: FileNode[]): FileNode[] => {
		if (!existing) return fresh;
		const byPath = new Map(existing.map((n) => [n.path, n]));

		return fresh.map((freshNode) => {
			const prev = byPath.get(freshNode.path);
			if (!prev) return freshNode;

			if (prev.isDir === freshNode.isDir) {
				return prev;
			}
			return freshNode;
		});
	};
}

export const project = new ProjectStore();
