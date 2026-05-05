<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';

	type Props = { icon: string; tooltip: string; selected?: string; onclick?: () => void };
	let { icon, tooltip, selected, onclick }: Props = $props();
</script>

<!-- # MARKUP # -->
{#if selected !== undefined}
	<a
		href={null}
		{onclick}
		class="hover:text-base-content flex h-12 w-12 items-center justify-center border-l-2 {selected === icon
			? 'bg-base-300/50 text-base-content border-l-primary'
			: 'text-primary/65 border-l-transparent'}
	tooltip tooltip-right"
		data-tip={tooltip}
	>
		<Icon {icon} width={24} class="-translate-x-px" />
	</a>
{:else}
	<a
		href={null}
		class="text-primary/50 hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center"
		data-tip={tooltip}
	>
		<Icon {icon} width={24} />
	</a>
{/if}
