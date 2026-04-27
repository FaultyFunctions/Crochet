<!-- # SCRIPT # -->
<script lang="ts">
	import SidebarFileTree from '$lib/components/Sidebar/SidebarFileTree.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
<aside class="h-screen bg-base-300">
	<div class="h-10 pl-4 bg-base-300 text-xs select-none content-center">
		<h4>EXPLORER - {projectStore.folderName}</h4>
	</div>
	<SidebarFileTree />
</aside>
