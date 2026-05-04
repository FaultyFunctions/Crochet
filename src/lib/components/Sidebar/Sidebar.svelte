<!-- # SCRIPT # -->
<script lang="ts">
	import FileTree from '$lib/components/Sidebar/FileTree.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
<aside class="grid grid-rows-[auto_1fr] bg-base-300 h-full overflow-y-auto">
	<div class="sticky top-0 z-10 h-10 pl-4 bg-base-300 text-xs select-none content-center">
		<h4>EXPLORER - {projectStore.config?.name}</h4>
	</div>
	<FileTree />
</aside>
