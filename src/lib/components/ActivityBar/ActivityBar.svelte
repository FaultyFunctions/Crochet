<!-- SCRIPT -->
<script lang="ts">
	import ActivityBarButton from '$lib/components/ActivityBar/ActivityBarButton.svelte';
	import NewProjectButton from '$lib/components/ActivityBar/NewProjectButton.svelte';

	let projectIcon = 'pajamas:project';
	let searchIcon = 'pajamas:search';
	let openProjectIcon = 'pajamas:folder-open';
	let exportIcon = 'pajamas:export';
	let settingsIcon = 'pajamas:settings';
	let infoIcon = 'pajamas:information-o';
	let selectedSection = $state<string>(projectIcon);
</script>

<!-- MARKUP -->
<aside class="bg-base-100 flex h-screen w-12 flex-col items-center justify-between">
	<div class="flex flex-col">
		<ActivityBarButton
			icon={projectIcon}
			tooltip="Project"
			selected={selectedSection}
			onclick={() => (selectedSection = projectIcon)}
		/>
		<ActivityBarButton
			icon={searchIcon}
			tooltip="Search"
			selected={selectedSection}
			onclick={() => (selectedSection = searchIcon)}
		/>
	</div>
	<div class="flex flex-col items-center">
		<NewProjectButton />
		<ActivityBarButton icon={openProjectIcon} tooltip="Open Project" />
		<ActivityBarButton icon={exportIcon} tooltip="Export" />
		<ActivityBarButton icon={settingsIcon} tooltip="Settings" />
		<ActivityBarButton icon={infoIcon} tooltip="Help" />
	</div>
</aside>

<!-- STYLE -->
<style>
</style>
