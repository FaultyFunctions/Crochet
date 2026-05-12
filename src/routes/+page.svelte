<!-- SCRIPT -->
<script lang="ts">
	import LandingPage from '$lib/components/LandingPage/LandingPage.svelte';
	import ProjectPage from '$lib/components/ProjectPage/ProjectPage.svelte';
	import { projectStore, ProjectState } from '$lib/stores/projectStore.svelte';
</script>

<!-- MARKUP -->
{#if projectStore.state === ProjectState.LANDING_PAGE}
	<LandingPage />
{:else if projectStore.state === ProjectState.PROJECT_OPEN}
	<ProjectPage />
{/if}

<!-- STYLE -->
<style>
</style>
