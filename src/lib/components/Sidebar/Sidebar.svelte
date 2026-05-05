<!-- # SCRIPT # -->
<script lang="ts">
	import FileTree from '$lib/components/Sidebar/FileTree.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
<aside class="bg-base-400 grid h-full grid-rows-[auto_1fr] overflow-x-hidden overflow-y-auto">
	<div class="sticky top-0 z-10 h-10 content-center pl-4 text-xs whitespace-nowrap select-none">
		<h4>EXPLORER - {projectStore.config?.name}</h4>
	</div>
	<FileTree />
</aside>
