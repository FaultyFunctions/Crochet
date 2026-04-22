<!-- # SCRIPT # -->
<script lang="ts">
	import Activitybar from '$lib/components/Activitybar/Activitybar.svelte';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
	import Workspace from '$lib/components/Workspace/Workspace.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
</script>

<!-- # MARKUP # -->
<PaneGroup direction="horizontal">
	<Activitybar />
	<Pane defaultSize={40}>
		<Sidebar />
	</Pane>
	<PaneResizer class="w-1 bg-base-200 hover:bg-neutral transition delay-150" />
	<Pane>
		<Workspace />
	</Pane>
</PaneGroup>

<!-- # STYLE # -->
<style>
</style>
