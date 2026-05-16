<!-- SCRIPT -->
<script lang="ts">
	import ActivityBar from '$lib/components/ActivityBar/ActivityBar.svelte';
	import Sash from '$lib/components/SidePanel/Sash.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Workspace from '$lib/components/Workspace/Workspace.svelte';
</script>

<!-- MARKUP -->
<div id="project-container" class="relative flex h-full w-full overflow-hidden">
	<ActivityBar />
	<SidePanel />
	<Sash />
	<div class="min-w-0 flex-1 overflow-hidden">
		<Workspace />
	</div>
</div>

<!-- STYLE -->
<style>
</style>
