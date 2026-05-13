<!-- SCRIPT -->
<script lang="ts">
	import RowIcons from '$lib/components/SidePanel/Explorer/RowIcons.svelte';
	import { explorerStore, type IExplorerNode } from '$lib/stores/explorerStore.svelte';
	import { projectStore, ProjectType } from '$lib/stores/projectStore.svelte';
	import { shortcut, type ShortcutParameter } from '@svelte-put/shortcut';

	const { node, depth, explorerElement }: { node: IExplorerNode; depth: number; explorerElement: HTMLDivElement } =
		$props();
	const isExpanded = $derived(explorerStore.isExpanded(node));
	const isSelected = $derived(explorerStore.isSelected(node));
	const isFocused = $derived(explorerStore.isFocused(node));
	const isRenaming = $derived(explorerStore.isRenaming(node));
	const fileExtension = projectStore.config?.projectType === ProjectType.YARNSPINNER ? '.yarn' : '.chatter';

	let buttonElement: HTMLButtonElement;
	// TODO: Check this warning out
	let inputElement: HTMLInputElement;
	let inputValue = $derived.by(() => {
		if (node.isDirectory) {
			return node.name;
		} else {
			return node.name.substring(0, node.name.lastIndexOf('.'));
		}
	});
	let fullNewName = $derived.by(() => {
		if (node.isDirectory) {
			return inputValue;
		} else {
			return inputValue.concat(fileExtension);
		}
	});

	$effect(() => {
		if (isFocused && buttonElement && document.activeElement !== buttonElement) {
			buttonElement.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
		}

		if (isRenaming) {
			inputElement?.focus();

			const lastDotIndex = inputElement?.value.lastIndexOf('.');
			inputElement?.setSelectionRange(0, lastDotIndex);
		}
	});

	const handleClick = (e: MouseEvent) => {
		if (explorerStore.isAnyRenaming()) return;
		explorerStore.select(node, e.ctrlKey || e.metaKey, e.shiftKey);
		if (node.isDirectory && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
			explorerStore.expandToggle(node);
		}
		explorerElement?.focus();
	};

	const shortcuts: ShortcutParameter = {
		trigger: [
			{
				key: 'Enter',
				modifier: false,
				preventDefault: true,
				callback: () => explorerStore.commitRename(node, fullNewName)
			},
			{ key: 'Escape', modifier: false, preventDefault: true, callback: () => explorerStore.cancelRename() }
		]
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
		if (e.target instanceof HTMLInputElement) return;
		e.preventDefault();
		explorerElement?.focus();
	}}
>
	<div class="row-indent pl-{depth * 4}"></div>
	<RowIcons isDirectory={node.isDirectory} {isExpanded} />
	{#if isRenaming}
		<div class="flex flex-row overflow-hidden">
			<input
				bind:this={inputElement}
				type="text"
				bind:value={inputValue}
				onblur={() => explorerStore.cancelRename()}
				use:shortcut={shortcuts}
				class="bg-base-600 inset-ring-primary field-sizing-content min-w-8 px-4"
			/>
			{#if !node.isDirectory}
				<div class="flex-1 px-2 text-left">{fileExtension}</div>
			{/if}
		</div>
	{:else}
		<span class="row-title truncate pl-1">{node.name} - {depth}</span>
	{/if}
</button>

<!-- STYLE -->
<style>
</style>
