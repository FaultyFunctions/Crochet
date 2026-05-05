<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
</script>

<!-- # MARKUP # -->
<button
	class="text-primary/50 hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center hover:cursor-pointer"
	data-tip="New Project"
	onclick={() => {
		projectStore.openProject();
	}}
>
	<Icon icon="pajamas:issue-new" width={24} />
</button>
