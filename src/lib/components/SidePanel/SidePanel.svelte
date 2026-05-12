<!-- SCRIPT -->
<script lang="ts">
	import Explorer from '$lib/components/SidePanel/Explorer/Explorer.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- MARKUP -->
<aside class="bg-base-300 h-full overflow-x-hidden overflow-y-auto">
	<header class="bg-base-500 sticky top-0 h-10 content-center pl-4 text-xs whitespace-nowrap select-none">
		EXPLORER - {projectStore.config?.name}
	</header>
	<Explorer />
</aside>

<!-- STYLE -->
<style>
</style>
