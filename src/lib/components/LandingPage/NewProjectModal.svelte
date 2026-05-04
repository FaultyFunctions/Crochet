<!-- # SCRIPT # -->
<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import { projectStore, ProjectType as ProjectType } from '$lib/stores/projectStore.svelte';
	import { checkProjectNameError } from '$lib/utils/validation';
	import Toast from '$lib/components/Toast/Toast.svelte';

	type Props = {
		dialog?: HTMLDialogElement;
	};

	let { dialog = $bindable() }: Props = $props();

	// State
	let projectName = $state('');
	let selectedDirectory = $state<string | null>(null);
	let projectType = $state<ProjectType>(ProjectType.YARNSPINNER);

	// Validation
	let projectNameError = $derived(checkProjectNameError(projectName));
	let canCreate = $derived(
		projectNameError === null && projectName.trim().length > 0 && projectType !== null && selectedDirectory != null
	);

	const handleBrowseDirectory = async () => {
		const directory = await invoke<string | null>('pick_directory');

		// Make sure we don't display null if the user cancels
		if (directory) selectedDirectory = directory;
	};

	const handleCreate = async (e: SubmitEvent) => {
		e.preventDefault();

		await projectStore.initialize({
			name: projectName,
			path: selectedDirectory!,
			projectType: projectType
		});
	};

	const resetForm = () => {
		projectName = '';
		selectedDirectory = null;
		projectType = ProjectType.YARNSPINNER;
	};
</script>

<!-- # MARKUP # -->
<dialog bind:this={dialog} class="modal" onclose={resetForm}>
	<div class="modal-box select-none">
		<h1 class="text-2xl font-bold text-center">Create New Project</h1>
		<div class="divider"></div>

		<form onsubmit={handleCreate}>
			<div class="flex flex-col gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Name</legend>
					<input
						type="text"
						required
						bind:value={projectName}
						class="input w-full bg-base-300"
						class:input-error={projectNameError !== null}
					/>
					{#if projectNameError}
						<p class="fieldset-label text-error">{projectNameError}</p>
					{/if}
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Directory</legend>
					<div class="flex join">
						<input
							type="text"
							class="input flex-1 join-item border-r-0 cursor-default bg-base-300"
							placeholder="No directory selected..."
							bind:value={selectedDirectory}
							required
							disabled
						/>
						<button type="button" class="btn btn-soft join-item" onclick={handleBrowseDirectory}>Browse</button>
					</div>
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Project Type</legend>
					<select bind:value={projectType} class="select w-full bg-base-300 appearance-none">
						<option value={ProjectType.YARNSPINNER}>Yarn Spinner</option>
						<option value={ProjectType.CHATTERBOX}>Chatterbox</option>
					</select>
				</fieldset>
			</div>
			<div class="modal-action">
				<button
					type="submit"
					disabled={!canCreate}
					class="btn btn-success btn-soft w-36"
					class:btn-disabled={!canCreate}
				>
					Create
				</button>
				<button type="button" onclick={() => dialog?.close()} class="btn btn-ghost btn-error">Cancel</button>
			</div>
		</form>
	</div>
	<Toast />
</dialog>
