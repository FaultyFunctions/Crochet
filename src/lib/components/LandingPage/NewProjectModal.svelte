<!-- # SCRIPT # -->
<script lang="ts">
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import { checkProjectNameError } from '$lib/utils/validation';

	type Props = {
		dialog?: HTMLDialogElement;
	};

	let { dialog = $bindable() }: Props = $props();

	// State
	let projectName = $state('');
	let selectedDirectory = $state<string | null>(null);
	let scriptingLanguage = $state<'ChatterScript' | 'Yarn Spinner Script' | null>(null);

	// Validation
	let projectNameError = $derived(checkProjectNameError(projectName));
	let canCreate = $derived(projectNameError === null && projectName.trim().length > 0 && scriptingLanguage !== null);

	async function selectDirectory() {
		await projectStore.openFolder();
		selectedDirectory = projectStore.projectPath;
	}

	async function handleCreate(e: SubmitEvent) {
		e.preventDefault();

		dialog?.close();
	}

	function resetForm() {
		projectName = '';
		selectedDirectory = null;
		scriptingLanguage = null;
	}
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
						class:input-error={projectNameError !== null} />
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
							value={selectedDirectory ?? ''}
							required
							disabled />
						<button type="button" class="btn btn-soft join-item" onclick={selectDirectory}>Browse</button>
					</div>
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Scripting Language</legend>
					<select bind:value={scriptingLanguage} class="select w-full bg-base-300 appearance-none">
						<option value={null} class="text-neutral" disabled selected hidden></option>
						<option>ChatterScript</option>
						<option>Yarn Spinner Script</option>
					</select>
				</fieldset>
			</div>
			<div class="modal-action">
				<button
					type="submit"
					disabled={!canCreate}
					class="btn btn-success btn-soft w-36"
					class:btn-disabled={!canCreate}>Create</button>
				<button type="button" onclick={() => dialog?.close()} class="btn btn-ghost btn-error">Cancel</button>
			</div>
		</form>
	</div>
</dialog>
