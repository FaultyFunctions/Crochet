<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';

	type Props = { icon: string; tooltip: string; selected?: string; onclick?: () => void };
	let { icon, tooltip, selected, onclick }: Props = $props();
</script>

<!-- # MARKUP # -->
{#if selected !== undefined}
	<a
		href="#"
		{onclick}
		class="h-12 w-12 flex items-center justify-center hover:text-base-content border-l-2 {selected === icon
			? 'bg-base-300/50 text-base-content border-l-primary'
			: 'text-primary/65 border-l-transparent'}
	tooltip tooltip-right"
		data-tip={tooltip}>
		<Icon {icon} width={24} class="-translate-x-px" />
	</a>
{:else}
	<a
		href="#"
		class="h-12 w-12 flex items-center justify-center text-primary/50 hover:text-base-content tooltip tooltip-right"
		data-tip={tooltip}>
		<Icon {icon} width={24} />
	</a>
{/if}
