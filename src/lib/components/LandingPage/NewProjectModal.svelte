<!-- SCRIPT -->
<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import { checkProjectNameError } from '$lib/utils/validation';
	import Toast from '$lib/components/Toast/Toast.svelte';

	type Props = {
		dialog?: HTMLDialogElement;
	};

	let { dialog = $bindable() }: Props = $props();

	// State
	let projectName = $state('');
	let selectedDirectory = $state<string | null>(null);

	// Validation
	let projectNameError = $derived.by(() => checkProjectNameError(projectName));
	let canCreate = $derived(projectNameError === null && selectedDirectory != null);

	const handleBrowseDirectory = async () => {
		const directory = await invoke<string | null>('pick_directory');

		// Make sure we don't display null if the user cancels
		if (directory) selectedDirectory = directory;
	};

	const handleCreate = async (e: SubmitEvent) => {
		e.preventDefault();

		await projectStore.createNewProject({
			name: projectName,
			path: selectedDirectory!
		});
	};

	const resetForm = () => {
		projectName = '';
		selectedDirectory = null;
	};
</script>

<!-- MARKUP -->
<dialog bind:this={dialog} class="modal" onclose={resetForm}>
	<div class="modal-box ring-base-300 p-0 ring-6 select-none">
		<div class="bg-primary flex h-18 w-full items-center">
			<h1 class="text-primary-content flex-1 text-center text-2xl font-bold">Create New Project</h1>
		</div>

		<form onsubmit={handleCreate} class="p-6">
			<div class="flex flex-col gap-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Project Name</legend>
					<input
						type="text"
						required
						bind:value={projectName}
						class="input bg-base-300 w-full"
						class:input-error={projectNameError !== null}
					/>
					{#if projectNameError}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<p class="fieldset-label text-error">{@html projectNameError}</p>
					{/if}
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Select Project Directory</legend>
					<div class="join flex">
						<input
							type="text"
							class="input join-item bg-base-300 flex-1 cursor-default border-r-0"
							placeholder="No directory selected..."
							bind:value={selectedDirectory}
							required
							disabled
						/>
						<button type="button" class="btn btn-soft join-item" onclick={handleBrowseDirectory}>Browse</button>
					</div>
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

<!-- STYLE -->
<style>
</style>
