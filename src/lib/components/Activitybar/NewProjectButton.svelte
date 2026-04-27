<!-- # SCRIPT # -->
<script lang="ts">
	import ActivitybarButton from '$lib/components/Activitybar/ActivitybarButton.svelte';
	import Icon from '@iconify/svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
<button
	class="h-12 w-12 flex items-center justify-center text-primary/50 hover:text-base-content tooltip tooltip-right hover:cursor-pointer"
	data-tip={'New Project'}
	onclick={() => {
		projectStore.openFolder();
		console.log('test');
	}}>
	<Icon icon="pajamas:issue-new" width={24} />
</button>
