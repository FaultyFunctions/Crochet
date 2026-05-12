<!-- SCRIPT -->
<script lang="ts">
	import { addToast } from '$lib/stores/toastStore.svelte';
	import { CircleQuestionMarkIcon } from '@lucide/svelte';
</script>

<!-- MARKUP -->
<button
	class="text-base-0 hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center hover:cursor-pointer"
	data-tip="Help"
	onclick={() => {
		addToast('Help Not Implemented Yet', 'info');
	}}
>
	<CircleQuestionMarkIcon />
</button>

<!-- STYLE -->
<style>
</style>
