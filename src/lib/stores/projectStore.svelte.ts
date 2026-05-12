import { PROJECT_FILE_VERSION } from '$lib/constants';
import { explorerStore } from '$lib/stores/explorerStore.svelte';
import { addToast } from '$lib/stores/toastStore.svelte';
import { invoke } from '@tauri-apps/api/core';
import { z } from 'zod';

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

class ProjectStore {
	config = $state<ProjectConfig | null>(null);
	state = $state<ProjectState>(ProjectState.LANDING_PAGE);

	initialize = async (initialConfig: InitialConfig): Promise<void> => {
		const config = { fileVersion: PROJECT_FILE_VERSION, ...initialConfig };

		try {
			await invoke('create_project_file', {
				name: config.name,
				path: config.path,
				config
			});

			this.config = config;
			await explorerStore.initialize(config.path);
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	openProjectFile = async (): Promise<void> => {
		try {
			const data = await invoke<string | null>('open_project_file');
			if (data === null) return;

			const config = ProjectConfigSchema.parse(JSON.parse(data));

			this.config = config;
			await explorerStore.initialize(config.path);
			this.state = ProjectState.PROJECT_OPEN;
		} catch (err) {
			addToast(String(err), 'error');
		}
	};

	close = (): void => {
		this.config = null;
		explorerStore.reset();
		this.state = ProjectState.LANDING_PAGE;
	};
}

export const projectStore = new ProjectStore();
