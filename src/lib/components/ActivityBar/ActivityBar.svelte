<!-- SCRIPT -->
<script lang="ts">
	import ExportButton from '$lib/components/ActivityBar/Buttons/ExportButton.svelte';
	import HelpButton from '$lib/components/ActivityBar/Buttons/HelpButton.svelte';
	import NewProjectButton from '$lib/components/ActivityBar/Buttons/NewProjectButton.svelte';
	import OpenProjectButton from '$lib/components/ActivityBar/Buttons/OpenProjectButton.svelte';
	import SectionButton from '$lib/components/ActivityBar/Buttons/SectionButton.svelte';
	import SettingsButton from '$lib/components/ActivityBar/Buttons/SettingsButton.svelte';
	import { FileCodeCornerIcon, SearchIcon } from '@lucide/svelte';

	const enum Section {
		PROJECT = 'PROJECT',
		SEARCH = 'SEARCH'
	}

	let selectedSection = $state<Section>(Section.PROJECT);
</script>

<!-- MARKUP -->
<aside class="bg-base-600 flex h-screen w-12 flex-col items-center justify-between">
	<div class="flex flex-col">
		<SectionButton
			IconComponent={FileCodeCornerIcon}
			tooltip="Project"
			selected={selectedSection === Section.PROJECT}
			onclick={() => (selectedSection = Section.PROJECT)}
		/>
		<SectionButton
			IconComponent={SearchIcon}
			tooltip="Search"
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
