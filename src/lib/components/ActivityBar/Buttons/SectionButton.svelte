<!-- SCRIPT -->
<script lang="ts">
	import type { LucideProps } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type Props = {
		IconComponent: Component<LucideProps>;
		tooltip: string;
		selected: boolean;
		onclick?: () => void;
	};
	let { IconComponent, tooltip, selected, onclick }: Props = $props();
</script>

<!-- MARKUP -->
{#if selected !== undefined}
	<a
		href={null}
		{onclick}
		class="hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center border-l-2 hover:cursor-pointer
			{selected ? 'bg-primary/10 text-base-content border-l-primary' : 'text-base-0 border-l-transparent'}"
		data-tip={tooltip}
	>
		<IconComponent width={24} class="-translate-x-px" />
	</a>
{:else}
	<a
		href={null}
		class="text-base-0 hover:text-base-content tooltip tooltip-right flex h-12 w-12 items-center justify-center hover:cursor-pointer"
		data-tip={tooltip}
	>
		<IconComponent width={24} />
	</a>
{/if}

<!-- STYLE -->
<style>
</style>
