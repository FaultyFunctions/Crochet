<!-- SCRIPT -->
<script lang="ts">
	import { toasts } from '$lib/stores/toastStore.svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { InfoIcon, CheckIcon, CircleAlertIcon, XIcon } from '@lucide/svelte';

	const config = {
		info: { class: 'alert-info', icon: InfoIcon },
		success: { class: 'alert-success', icon: CheckIcon },
		warning: { class: 'alert-warning', icon: CircleAlertIcon },
		error: { class: 'alert-error', icon: XIcon }
	};
</script>

<!-- MARKUP -->
<div
	class="pointer-events-none fixed top-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pt-4 select-none"
>
	{#each toasts.value as toast (toast.id)}
		{@const type = config[toast.type] || config.error}
		{@const Icon = type.icon}
		<div
			animate:flip={{ duration: 300 }}
			in:fly={{ y: -80, duration: 150 }}
			out:fly={{ duration: 150 }}
			class="alert {type.class} alert-soft pointer-events-auto"
		>
			<Icon class="-mr-2" width={16} />
			<span>{toast.message}</span>
		</div>
	{/each}
</div>

<!-- STYLE -->
<style>
</style>
