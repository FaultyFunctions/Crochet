<!-- SCRIPT -->
<script lang="ts">
	import ExportButton from '$lib/components/ActivityBar/Buttons/ExportButton.svelte';
	import HelpButton from '$lib/components/ActivityBar/Buttons/HelpButton.svelte';
	import NewProjectButton from '$lib/components/ActivityBar/Buttons/NewProjectButton.svelte';
	import OpenProjectButton from '$lib/components/ActivityBar/Buttons/OpenProjectButton.svelte';
	import SectionButton from '$lib/components/ActivityBar/Buttons/SectionButton.svelte';
	import SettingsButton from '$lib/components/ActivityBar/Buttons/SettingsButton.svelte';
	import { FolderTreeIcon, SearchIcon } from '@lucide/svelte';

	const enum Section {
		EXPLORER = 'EXPLORER',
		SEARCH = 'SEARCH'
	}

	let selectedSection = $state<Section>(Section.EXPLORER);
</script>

<!-- MARKUP -->
<aside class="bg-base-200 flex h-screen w-12 flex-col items-center justify-between">
	<div class="flex flex-col">
		<SectionButton
			IconComponent={FolderTreeIcon}
			tooltip="Explorer Panel"
			selected={selectedSection === Section.EXPLORER}
			onclick={() => (selectedSection = Section.EXPLORER)}
		/>
		<SectionButton
			IconComponent={SearchIcon}
			tooltip="Search Panel"
			selected={selectedSection === Section.SEARCH}
			onclick={() => (selectedSection = Section.SEARCH)}
		/>
	</div>
	<div class="flex flex-col items-center">
		<NewProjectButton />
		<OpenProjectButton />
		<ExportButton />
		<SettingsButton />
		<HelpButton />
	</div>
</aside>

<!-- STYLE -->
<style>
</style>
