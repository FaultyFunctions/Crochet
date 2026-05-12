<!-- SCRIPT -->
<script lang="ts">
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import { PackagePlusIcon } from '@lucide/svelte';
</script>

<!-- MARKUP -->
<button
	class="text-base-0 hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center hover:cursor-pointer"
	data-tip="New Project"
	onclick={() => {
		projectStore.openProjectFile();
	}}
>
	<PackagePlusIcon />
</button>

<!-- STYLE -->
<style>
</style>
