<!-- SCRIPT -->
<script lang="ts">
	import RowIcons from '$lib/components/SidePanel/Explorer/RowIcons.svelte';
	import { explorerStore } from '$lib/stores/explorerStore.svelte';

	const { node, depth, explorerElement } = $props();
	const isExpanded = $derived(explorerStore.isExpanded(node));
	const isSelected = $derived(explorerStore.isSelected(node));
	const isFocused = $derived(explorerStore.isFocused(node));

	let buttonElement: HTMLButtonElement;

	$effect(() => {
		if (isFocused && buttonElement && document.activeElement !== buttonElement) {
			buttonElement.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
		}
	});

	const handleClick = (e: MouseEvent) => {
		explorerStore.select(node, e.ctrlKey || e.metaKey, e.shiftKey);
		if (node.isDirectory && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
			explorerStore.expandToggle(node);
		}
		explorerElement?.focus();
	};
</script>

<!-- MARKUP -->
<button
	bind:this={buttonElement}
	role="treeitem"
	aria-level={depth + 1}
	aria-expanded={node.isDirectory ? isExpanded : undefined}
	aria-selected={isSelected}
	tabindex="-1"
	class="explorer-row hover:not-selected:bg-base-100 flex w-full cursor-pointer items-center pl-1 select-none {isSelected
		? 'bg-primary/10'
		: ''}"
	class:selected={isSelected}
	// class:bg-base-100={isSelected}
	class:inset-ring={isFocused}
	class:ring-red={isFocused}
	title={node.path}
	onclick={handleClick}
	onmousedown={(e) => {
		e.preventDefault();
		explorerElement?.focus();
	}}
>
	<div class="row-indent pl-{depth * 4}"></div>
	<RowIcons isDirectory={node.isDirectory} {isExpanded} />
	<span class="row-title truncate pl-1">{node.name} - {depth}</span>
</button>

<!-- STYLE -->
<style>
</style>
