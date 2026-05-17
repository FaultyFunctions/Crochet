<!-- SCRIPT -->
<script lang="ts">
	import RowIcons from '$lib/components/SidePanel/Explorer/RowIcons.svelte';
	import { explorerStore, type IExplorerNode } from '$lib/stores/explorerStore.svelte';
	import { shortcut, type ShortcutEventDetail, type ShortcutParameter } from '@svelte-put/shortcut';

	const { node, depth }: { node: IExplorerNode; depth: number } = $props();
	const isExpanded = $derived(explorerStore.isExpanded(node));
	const isSelected = $derived(explorerStore.isSelected(node));
	const isFocused = $derived(explorerStore.isFocused(node));
	const isRenaming = $derived(explorerStore.isRenaming(node));
	const fileExtension = $derived(node.isDirectory ? '' : node.name.slice(node.name.lastIndexOf('.')));
	const renameShortcuts: ShortcutParameter = {
		trigger: [
			{
				key: 'Enter',
				modifier: false,
				preventDefault: true,
				callback: (detail: ShortcutEventDetail) => {
					detail.originalEvent.stopPropagation();
					inputElement?.blur();
					explorerStore.select(node);
				}
			},
			{
				key: 'Escape',
				modifier: false,
				preventDefault: true,
				callback: (detail: ShortcutEventDetail) => {
					detail.originalEvent.stopPropagation();
					console.log(detail);
					explorerStore.select(node);
				}
			}
		]
	};

	let buttonElement = $state<HTMLButtonElement | undefined>();
	let inputElement = $state<HTMLInputElement | undefined>();
	let inputValue = $derived(node.isDirectory ? node.name : node.name.substring(0, node.name.lastIndexOf('.')));
	const validationMessage = $derived(explorerStore.getNameError(inputValue));

	$effect(() => {
		if (isFocused && buttonElement) {
			buttonElement.focus({ focusVisible: true });
			buttonElement.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
		}
	});

	$effect(() => {
		if (isRenaming) {
			inputElement?.focus();
			inputElement?.select();
			explorerStore.clearFocus();
		}
	});

	// Renaming input validation
	$effect(() => {
		if (validationMessage) {
			inputElement?.setCustomValidity(validationMessage);
			inputElement?.setAttribute('aria-invalid', 'true');
		} else {
			inputElement?.setCustomValidity('');
			inputElement?.setAttribute('aria-invalid', 'false');
		}
	});

	const handleClick = (e: MouseEvent) => {
		if (explorerStore.isAnyRenaming()) return;

		explorerStore.select(node, e.ctrlKey || e.metaKey, e.shiftKey);
		if (node.isDirectory && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
			explorerStore.expandToggle(node);
		}
	};

	const handleInputBlur = () => {
		console.log(inputValue);
		explorerStore.commitRename(node, inputValue);
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
	class="explorer-row hover:not-selected:bg-base-100 flex w-full cursor-pointer items-center pl-1 select-none"
	class:selected={isSelected}
	class:focused={isFocused}
	class:selected-dimmed={isSelected && !explorerStore.isActive}
	aria-label={node.path}
	onclick={handleClick}
>
	<div class="row-indent pl-{depth * 4}"></div>
	<RowIcons isDirectory={node.isDirectory} {isExpanded} />
	{#if isRenaming}
		<!-- TODO: FIX OVERFLOW HIDDEN HERE -->
		<div class="flex w-full">
			<input
				bind:this={inputElement}
				type="text"
				bind:value={inputValue}
				onblur={handleInputBlur}
				use:shortcut={renameShortcuts}
				class="bg-base-600 mr-1 ml-1 w-full min-w-8"
			/>
			<div class="absolute top-4">Test 123</div>
			<!-- TODO: CREATE VALIDATION ELEMENT AN POSITION IT PROPERLY -->
			<!-- <div class="validator-hint absolute translate-y-4">THIS IS A TEST</div> -->
			{#if !node.isDirectory}
				<div class="mr-1 px-2 text-right">{fileExtension}</div>
			{/if}
		</div>
	{:else}
		<span class="row-title truncate pl-1">{node.name}</span>
	{/if}
</button>

<!-- STYLE -->
<style>
	@reference "$lib/../app.css";

	button.explorer-row:focus-visible,
	button.explorer-row:focus {
		outline: none;
	}

	input:focus-visible,
	input:focus {
		outline: none;
		@apply outline-accent outline-1;
	}

	.explorer-row.focused {
		@apply bg-base-100 inset-ring-1;
	}

	.explorer-row.selected:not(selected-dimmed) {
		@apply bg-base-0;
	}

	.explorer-row.selected.selected-dimmed {
		@apply bg-base-100;
	}
</style>
