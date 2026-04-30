import { invoke } from '@tauri-apps/api/core';
import type { FileNode } from '$lib/types/fileTree';
import { addToast } from '$lib/stores/toastStore.svelte';
import { CURRENT_PROJECT_VERSION } from '$lib/constants';

interface InitialConfig {
	name: string;
	path: string;
	scriptType: ScriptType;
}

interface ProjectConfig extends InitialConfig {
	projectVersion: number;
}

export enum ProjectState {
	LANDING_PAGE = 'LANDING_PAGE',
	LOADING_PROJECT = 'LOADING_PROJECT',
	PROJECT_OPEN = 'PROJECT_OPEN'
}

export enum ScriptType {
	YARNSPINNER = 'YARNSPINNER',
	CHATTERBOX = 'CHATTERBOX'
}

// TODO: Convert Project Store to Class
class ProjectStore {
	// # State
	config = $state<ProjectConfig | null>(null);
	fileTree = $state<FileNode[]>([]);
	state = $state<ProjectState>(ProjectState.LANDING_PAGE);

	initialize = async (initialConfig: InitialConfig): Promise<void> => {
		this.config = {
			projectVersion: CURRENT_PROJECT_VERSION,
			...initialConfig
		};

		try {
			console.log(initialConfig.path);
			await invoke('create_project_file', { name: initialConfig.name, path: initialConfig.path, config: this.config });
			this.state = ProjectState.LOADING_PROJECT;

			this.fileTree = await invoke<FileNode[]>('get_sorted_directory_contents', { path: initialConfig.path });
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			console.error(err);
			addToast(String(err), 'error');
			this.#resetState();
		}
	};

	#resetState = () => {
		this.config = null;
		this.state = ProjectState.LANDING_PAGE;
	};
}

export const project = new ProjectStore();

// let projectPath = $state<string | null>(null);
// let fileTree = $state<FileNode[]>([]);
// // TODO: This will eventually be reassignable I think
// // eslint-disable-next-line prefer-const
// let directoryName = $derived(projectPath ? (projectPath.split(/[\\/]/).at(-1) ?? null) : null);
// let appState = $state<AppState>(AppState.LANDING_PAGE);

// // Create project file
// async function initializeProject(params: { name: string; path: string; scriptType: ScriptType }): Promise<void> {
// 	appState = AppState.LOADING_PROJECT;

// 	try {
// 		await invoke('create_project_file', { ...params });

// 		fileTree = await invoke<FileNode[]>('read_directory', {
// 			path: params.path
// 		});

// 		// TODO: Do I need this variable?
// 		projectPath = params.path;
// 	} catch (err) {
// 		console.error(err);
// 		addToast(String(err), 'error');
// 		resetAppState();
// 	} finally {
// 		appState = AppState.PROJECT_OPEN;
// 	}
// }

// async function openProject(): Promise<void> {
// 	const selected = await invoke<string | null>('pick_directory');

// 	if (selected === null) return; // User Cancelled

// 	appState = AppState.LOADING_PROJECT;
// 	try {
// 		fileTree = await invoke<FileNode[]>('read_directory', { path: selected });
// 	} catch (e) {
// 		// TODO: Maybe better error handling?
// 		console.error(e);
// 		addToast(String(e), 'error');
// 		resetAppState();
// 	} finally {
// 		appState = AppState.PROJECT_OPEN;
// 	}
// }

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

// function resetAppState() {
// 	appState = AppState.LANDING_PAGE;
// }

// export const projectStore = {
// 	get projectPath() {
// 		return projectPath;
// 	},
// 	get fileTree() {
// 		return fileTree;
// 	},
// 	get directoryName() {
// 		return directoryName;
// 	},
// 	get appState() {
// 		return appState;
// 	},
// 	openProject,
// 	pickDirectory,
// 	initializeProject,
// 	lazyLoadFolder
// };
