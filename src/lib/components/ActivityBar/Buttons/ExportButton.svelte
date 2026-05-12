<!-- SCRIPT -->
<script lang="ts">
	import { addToast } from '$lib/stores/toastStore.svelte';
	import { ShareIcon } from '@lucide/svelte';
</script>

<!-- MARKUP -->
<button
	class="text-base-0 hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center hover:cursor-pointer"
	data-tip="Export Project"
	onclick={() => {
		addToast('Export Options Not Implemented Yet', 'info');
	}}
>
	<ShareIcon />
</button>

<!-- STYLE -->
<style>
</style>
