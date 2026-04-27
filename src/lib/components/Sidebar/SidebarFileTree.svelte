<!-- # SCRIPT # -->
<script lang="ts">
	import SidebarItem from '$lib/components/Sidebar/SidebarItem.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
<ul class="menu bg-base-200 w-full p-0">
	{#if projectStore.fileTree.length === 0}
		<li class="text-base-content/40 text-xs p-4 select-none">No folder open</li>
	{:else}
		{#each projectStore.fileTree as node}
			<SidebarItem {node} />
		{/each}
	{/if}
</ul>
