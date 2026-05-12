<!-- SCRIPT -->
<script lang="ts">
	import { explorerStore } from '$lib/stores/explorerStore.svelte';
	import { FileTextIcon, ChevronRight, ChevronDown, FolderIcon, FolderOpenIcon } from '@lucide/svelte';
	let { node, depth } = $props();
</script>

<!-- MARKUP -->
<button
	class="hover:bg-base-100 flex w-full cursor-pointer items-center select-none"
	class:selected={explorerStore.isSelected(node)}
	onclick={() => {
		explorerStore.select(node);
		if (node.isDirectory) explorerStore.expandToggle(node);
	}}
>
	<div class="flex shrink-0">
		{#if node.isDirectory}
			{#if explorerStore.isExpanded(node)}
				<ChevronDown class="size-4" />
				<FolderOpenIcon class="size-4" />
			{:else}
				<ChevronRight class="size-4" />
				<FolderIcon class="size-4" />
			{/if}
		{:else}
			<div class="pl-4"></div>
			<FileTextIcon class="size-4" />
		{/if}
	</div>
	<span class="truncate">{node.name} - {depth}</span>
</button>

<!-- STYLE -->
<style>
</style>
