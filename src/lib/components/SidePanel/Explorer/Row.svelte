<!-- SCRIPT -->
<script lang="ts">
	import RowIcons from '$lib/components/SidePanel/Explorer/RowIcons.svelte';
	import { explorerStore, type IExplorerNode } from '$lib/stores/explorerStore.svelte';
	import { checkFileNameError } from '$lib/utils/validation';
	import { shortcut, type ShortcutEventDetail, type ShortcutParameter } from '@svelte-put/shortcut';
	import { tick } from 'svelte';

	const { node, depth }: { node: IExplorerNode; depth: number } = $props();
	const isExpanded = $derived(explorerStore.isExpanded(node));
	const isSelected = $derived(explorerStore.isSelected(node));
	const isFocused = $derived(explorerStore.isFocused(node));
	const isRenaming = $derived(explorerStore.isRenaming(node));
	const renameShortcuts: ShortcutParameter = {
		trigger: [
			{
				key: 'Enter',
				modifier: false,
				preventDefault: true,
				callback: (detail: ShortcutEventDetail): void => {
					detail.originalEvent.stopPropagation();

					if (inputValue === node.name) {
						cancelRename();
					} else if (validationMessage === null) {
						commitRename();
					}
				}
			},
			{
				key: 'Escape',
				modifier: false,
				preventDefault: true,
				callback: (detail: ShortcutEventDetail): void => {
					detail.originalEvent.stopPropagation();
					cancelRename();
				}
			}
		]
	};

	let buttonElement = $state<HTMLButtonElement | undefined>();
	let inputElement = $state<HTMLInputElement | undefined>();
	let inputValue = $derived(node.name);
	const validationMessage = $derived(checkFileNameError(inputValue));

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

	const cancelRename = async () => {
		explorerStore.cancelRename();
		await tick();
		explorerStore.select(node);
		inputValue = node.name;
	};

	const commitRename = async () => {
		await explorerStore.commitRename(node, inputValue);
		explorerStore.select(node);
	};

	const handleClick = (e: MouseEvent) => {
		if (explorerStore.isAnyRenaming()) return;

		explorerStore.select(node, e.ctrlKey || e.metaKey, e.shiftKey);
		if (node.isDirectory && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
			explorerStore.expandToggle(node);
		}
	};

	const handleInputFocusOut = async () => {
		if (!explorerStore.isRenaming(node)) {
			return;
		} else if (validationMessage !== null) {
			cancelRename();
			return;
		}

		if (inputValue === node.name) {
			cancelRename();
		} else if (validationMessage === null) {
			commitRename();
		}
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
	class="explorer-row hover:not-selected:bg-base-100 flex w-full cursor-pointer items-start pl-1 select-none"
	class:selected={isSelected}
	class:focused={isFocused}
	class:selected-dimmed={isSelected && !explorerStore.isActive}
	aria-label={node.path}
	onclick={handleClick}
>
	<div class="row-indent pl-{depth * 4}"></div>
	<RowIcons isDirectory={node.isDirectory} {isExpanded} />
	{#if isRenaming}
		<div class="relative mr-0.5 flex flex-1 flex-col">
			<input
				bind:this={inputElement}
				type="text"
				bind:value={inputValue}
				onfocusout={handleInputFocusOut}
				use:shortcut={renameShortcuts}
				class="bg-base-600 w-full min-w-8 px-1"
				class:input-error={!!validationMessage}
				spellcheck="false"
			/>
			{#if validationMessage}
				<div
					class="text-base-content bg-error-content outline-error text-strong absolute top-full z-10 -mt-0.5 w-full translate-y-1 cursor-default p-1 text-left align-middle text-sm outline-2"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html validationMessage}
				</div>
			{/if}
		</div>
		{#if !node.isDirectory}
			<div class="mr-1 px-2 text-right">{explorerStore.fileExtension}</div>
		{/if}
	{:else}
		<span class="row-title truncate pl-1">{node.name}{node.isDirectory ? '' : explorerStore.fileExtension}</span>
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
		@apply outline-base-0 outline-1;
	}

	.input-error {
		@apply outline-error! outline-2!;
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
