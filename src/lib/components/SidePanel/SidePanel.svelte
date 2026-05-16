<!-- SCRIPT -->
<script lang="ts">
	import Explorer from '$lib/components/SidePanel/Explorer/Explorer.svelte';
	import { sidePanelStore } from '$lib/stores/sidePanelStore.svelte';
</script>

<!-- MARKUP -->
<aside
	class="bg-base-300 relative flex h-full shrink-0 flex-col overflow-hidden ease-out"
	class:transition-[width]={sidePanelStore.isTransitioning}
	class:duration-150={sidePanelStore.isTransitioning}
	style:width={`${sidePanelStore.getWidth()}px`}
	ontransitionend={sidePanelStore.completeTransition}
>
	<Explorer />
</aside>

<!-- STYLE -->
<style>
</style>
