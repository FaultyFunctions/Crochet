import { invoke } from '@tauri-apps/api/core';
import type { FileNode } from '$lib/types/fileTree';
import { addToast } from '$lib/stores/toastStore.svelte';
import { PROJECT_FILE_VERSION } from '$lib/constants';
import { z } from 'zod';

export enum ProjectState {
	LANDING_PAGE = 'LANDING_PAGE',
	LOADING_PROJECT = 'LOADING_PROJECT',
	PROJECT_OPEN = 'PROJECT_OPEN'
}

export enum ScriptType {
	YARNSPINNER = 'YARNSPINNER',
	CHATTERBOX = 'CHATTERBOX'
}

const InitialConfigSchema = z.object({
	name: z.string(),
	path: z.string(),
	scriptType: z.enum(ScriptType)
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

	initialize = async (initialConfig: InitialConfig): Promise<void> => {
		// Store previous project state in case something goes wrong
		const previousConfig = this.config;
		const previousFileTree = this.fileTree;
		const previousState = this.state;

		this.config = {
			fileVersion: PROJECT_FILE_VERSION,
			...initialConfig
		};

		try {
			await invoke('create_project_file', { name: initialConfig.name, path: initialConfig.path, config: this.config });
			this.state = ProjectState.LOADING_PROJECT;

			this.fileTree = await invoke<FileNode[]>('get_sorted_directory_contents', { path: initialConfig.path });
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			console.error(err);
			addToast(String(err), 'error');
			// Restore previous project state
			this.config = previousConfig;
			this.fileTree = previousFileTree;
			this.state = previousState;
		}
	};

	openProjectFile = async (): Promise<void> => {
		// Store previous project state in case something goes wrong
		const previousConfig = this.config;
		const previousFileTree = this.fileTree;
		const previousState = this.state;

		try {
			const data = await invoke<string | null>('open_project_file');
			if (data === null) return; // User Cancelled

			this.config = ProjectConfigSchema.parse(JSON.parse(data));
			this.fileTree = await invoke<FileNode[]>('get_sorted_directory_contents', { path: this.config.path });
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			console.error(err);
			addToast(String(err), 'error');
			// Restore previous project state
			this.config = previousConfig;
			this.fileTree = previousFileTree;
			this.state = previousState;
		}
	};
}

export const project = new ProjectStore();

// /** Lazily loads children for a folder node when it's expanded. */
// async function lazyLoadFolder(node: FileNode): Promise<void> {
// 	if (!node.isDir || (node.children && node.children.length > 0)) return;
// 	try {
// 		const children = await invoke<FileNode[]>('read_directory', { path: node.path });
// 		node.children = children;
// 	} catch (e) {
// 		// TODO: Maybe better error handling?
// 		console.error(e);
// 	}
// }
