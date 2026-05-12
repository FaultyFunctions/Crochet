<!-- SCRIPT -->
<script lang="ts">
	import ExplorerRow from '$lib/components/SidePanel/Explorer/ExplorerRow.svelte';
	import { explorerStore } from '$lib/stores/explorerStore.svelte';
</script>

<!-- MARKUP -->
<div id="explorer">
	{#each explorerStore.visibleRows as { node, depth } (node.path)}
		<ExplorerRow {node} {depth} />
	{/each}
</div>

<!-- STYLE -->
<style>
</style>
