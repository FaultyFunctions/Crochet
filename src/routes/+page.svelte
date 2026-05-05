<!-- SCRIPT -->
<script lang="ts">
	import ActivityBar from '$lib/components/ActivityBar/ActivityBar.svelte';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
	import Workspace from '$lib/components/Workspace/Workspace.svelte';
	import LandingPage from '$lib/components/LandingPage/LandingPage.svelte';
	import { projectStore, ProjectState } from '$lib/stores/projectStore.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import Toast from '$lib/components/Toast/Toast.svelte';
</script>

<!-- MARKUP -->
{#if projectStore.state === ProjectState.LANDING_PAGE}
	<LandingPage />
{:else if projectStore.state === ProjectState.PROJECT_OPEN}
	<PaneGroup direction="horizontal" class="h-full">
		<ActivityBar />
		<Pane defaultSize={40} class="h-full">
			<Sidebar />
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
{/if}

<!-- STYLE -->
<style>
</style>
