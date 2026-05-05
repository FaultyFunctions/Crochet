<script lang="ts">
	import Icon from '@iconify/svelte';
	import { toasts } from '$lib/stores/toastStore.svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const config = {
		info: { class: 'alert-info', icon: 'pajamas-information' },
		success: { class: 'alert-success', icon: 'pajamas-check-circle-filled' },
		warning: { class: 'alert-warning', icon: 'pajamas-warning-solid' },
		error: { class: 'alert-error', icon: 'pajamas-clear' }
	};
</script>

<div
	class="pointer-events-none fixed top-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pt-4 select-none"
>
	{#each toasts.value as toast (toast.id)}
		{@const type = config[toast.type] || config.error}
		<div
			animate:flip={{ duration: 300 }}
			in:fly={{ y: -80, duration: 150 }}
			out:fly={{ duration: 150 }}
			class="alert {type.class} alert-soft pointer-events-auto"
		>
			<Icon icon={type.icon} class="-mr-2" width={16} />
			<span>{toast.message}</span>
		</div>
	{/each}
</div>
