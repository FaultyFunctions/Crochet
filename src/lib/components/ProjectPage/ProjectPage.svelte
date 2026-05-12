<!-- SCRIPT -->
<script lang="ts">
	import ActivityBar from '$lib/components/ActivityBar/ActivityBar.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import Workspace from '$lib/components/Workspace/Workspace.svelte';
	import { Pane, PaneGroup, PaneResizer } from 'paneforge';
</script>

<!-- MARKUP -->
<PaneGroup direction="horizontal" class="h-full">
	<ActivityBar />
	<Pane defaultSize={40} class="h-full">
		<SidePanel />
	</Pane>
	<PaneResizer class="group relative w-0 overflow-visible">
		<div
			class="bg-neutral absolute inset-y-0 z-10 w-1 -translate-x-1
				opacity-0 transition delay-150 group-hover:opacity-100 group-data-active:opacity-100"
		></div>
	</PaneResizer>
	<Pane>
		<Workspace />
	</Pane>
</PaneGroup>
<Toast />

<!-- STYLE -->
<style>
</style>
