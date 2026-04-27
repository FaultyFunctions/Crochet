<!-- # SCRIPT # -->
<script lang="ts">
	import ActivitybarButton from '$lib/components/Activitybar/ActivitybarButton.svelte';
	import NewProjectButton from '$lib/components/Activitybar/NewProjectButton.svelte';

	let projectIcon = 'pajamas:project';
	let searchIcon = 'pajamas:search';
	let openProjectIcon = 'pajamas:folder-open';
	let exportIcon = 'pajamas:export';
	let settingsIcon = 'pajamas:settings';
	let infoIcon = 'pajamas:information-o';
	let selectedSection = $state<string>(projectIcon);
</script>

<!-- # MARKUP # -->
<aside class="w-12 h-screen bg-base-100 flex flex-col items-center justify-between">
	<div class="flex flex-col">
		<ActivitybarButton
			icon={projectIcon}
			tooltip="Project"
			selected={selectedSection}
			onclick={() => (selectedSection = projectIcon)} />
		<ActivitybarButton
			icon={searchIcon}
			tooltip="Search"
			selected={selectedSection}
			onclick={() => (selectedSection = searchIcon)} />
	</div>
	<div class="flex flex-col items-center">
		<NewProjectButton />
		<ActivitybarButton icon={openProjectIcon} tooltip="Open Project" />
		<ActivitybarButton icon={exportIcon} tooltip="Export" />
		<ActivitybarButton icon={settingsIcon} tooltip="Settings" />
		<ActivitybarButton icon={infoIcon} tooltip="Help" />
	</div>
</aside>
