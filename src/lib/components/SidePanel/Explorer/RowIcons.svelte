<!-- SCRIPT -->
<script lang="ts">
	import { ChevronRightIcon, ChevronDownIcon, FolderIcon, FolderOpenIcon, SpoolIcon } from '@lucide/svelte';

	const { isDirectory, isExpanded } = $props();
</script>

<!-- MARKUP -->
<div class="icon-wrapper flex shrink-0">
	{#if isDirectory}
		{#if isExpanded}
			<ChevronDownIcon class="row-twistie ml-1 size-4" />
			<FolderOpenIcon class="row-icon ml-1 size-4" />
		{:else}
			<ChevronRightIcon class="row-twistie ml-1 size-4" />
			<FolderIcon class="row-icon ml-1 size-4" />
		{/if}
	{:else}
		<div class="row-twistie pl-4"></div>
		<SpoolIcon class="row-icon ml-2 size-4" />
	{/if}
</div>

<!-- STYLE -->
<style>
</style>
