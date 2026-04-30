<!-- # SCRIPT # -->
<script lang="ts">
	import FileTreeItem from '$lib/components/Sidebar/FileTreeItem.svelte';
	import { project } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
{#if project.fileTree.length === 0}
	<p class="text-base-content/40 text-xs p-4 select-none">No folder open</p>
{:else}
	<ul class="menu bg-base-200 w-full p-0">
		{#if project.fileTree.length === 0}
			<li class="text-base-content/40 text-xs p-4 select-none">No folder open</li>
		{:else}
			{#each project.fileTree as node (node.path)}
				<FileTreeItem {node} />
			{/each}
		{/if}
	</ul>
{/if}
