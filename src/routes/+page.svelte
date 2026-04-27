<!-- # SCRIPT # -->
<script lang="ts">
	import Activitybar from '$lib/components/Activitybar/Activitybar.svelte';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
	import Workspace from '$lib/components/Workspace/Workspace.svelte';
	import LandingPage from '$lib/components/LandingPage/LandingPage.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
</script>

<!-- # MARKUP # -->
{#if projectStore.projectPath}
	<PaneGroup direction="horizontal">
		<Activitybar />
		<Pane defaultSize={40}>
			<Sidebar />
		</Pane>
		<PaneResizer class="relative w-0 overflow-visible group">
			<div
				class="absolute inset-y-0 -translate-x-1 w-1 bg-neutral opacity-0
				group-hover:opacity-100 group-data-active:opacity-100 transition delay-150 z-10">
			</div>
		</PaneResizer>
		<Pane>
			<Workspace />
		</Pane>
	</PaneGroup>
{:else}
	<LandingPage />
{/if}

<!-- # STYLE # -->
<style>
</style>
