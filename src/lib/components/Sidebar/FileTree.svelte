<!-- # SCRIPT # -->
<script lang="ts">
	import { fileTreeStore } from '$lib/stores/fileTreeStore.svelte';
	import { adaptReactProps } from '$lib/utils/adaptReactProps';
	import FileTreeRow from './FileTreeRow.svelte';

	const tree = $derived(fileTreeStore.tree);
	const treeRows = $derived(fileTreeStore.treeRows);
	const containerProps = $derived(tree ? adaptReactProps(tree.getContainerProps()) : {});
</script>

<!-- # MARKUP # -->
{#if tree}
	<div {...containerProps} class="flex flex-col py-1 min-w-0">
		{#each treeRows as treeRow (treeRow.id)}
			<FileTreeRow {treeRow} />
		{/each}
	</div>
{:else}
	<div class="px-3 py-2 text-sm opacity-60">No project loaded.</div>
{/if}
