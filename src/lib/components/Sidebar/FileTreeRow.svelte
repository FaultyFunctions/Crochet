<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { TreeRow } from '$lib/stores/fileTreeStore.svelte';

	let { treeRow: treeRow }: { treeRow: TreeRow } = $props();
</script>

<!-- # MARKUP # -->
<button
	{...treeRow.props}
	class="flex w-full items-center gap-1.5 py-0.5 pr-2 text-left text-sm"
	class:bg-base-100={treeRow.isSelected}
	class:inset-ring-secondary={treeRow.isFocused}
	class:inset-ring={treeRow.isFocused}
	style:padding-left="{treeRow.level * 0.75 + 0.5}rem"
>
	{#if treeRow.isFolder}
		<Icon icon={treeRow.isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'} class="shrink-0 opacity-60" />
		<Icon icon={treeRow.isExpanded ? 'mdi:folder-open' : 'mdi:folder'} class="shrink-0 text-amber-500" />
	{:else}
		<span class="w-4 shrink-0"></span>
		<Icon icon="mdi:file-document-outline" class="shrink-0 opacity-70" />
	{/if}
	<span class="truncate min-w-0 flex-1">{treeRow.name}</span>
</button>
