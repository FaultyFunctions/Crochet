<!-- SCRIPT -->
<script lang="ts">
	import Row from '$lib/components/SidePanel/Explorer/Row.svelte';
	import { explorerStore } from '$lib/stores/explorerStore.svelte';
	import { CopyMinusIcon, CopyPlusIcon, SearchIcon } from '@lucide/svelte';
	import { shortcut, type ShortcutParameter } from '@svelte-put/shortcut';

	let explorerElement = $state<HTMLDivElement | undefined>();

	const handleClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			explorerStore.clearSelection();
			explorerStore.clearFocus();
		}
	};

	const handleFocusGained = () => {
		explorerStore.isActive = true;
	};

	const handleFocusLost = (e: FocusEvent) => {
		if (!explorerElement?.contains(e.relatedTarget as Node)) {
			explorerStore.clearFocus();
			explorerStore.isActive = false;
		}
	};

	const shortcuts = $derived<ShortcutParameter>({
		enabled: !explorerStore.isAnyRenaming(),
		trigger: [
			{ key: 'Enter', modifier: false, preventDefault: true, callback: () => explorerStore.activateFocused() },
			{ key: ' ', modifier: false, preventDefault: true, callback: () => explorerStore.activateFocused() },
			// TODO: Something needs to be done here? Or move this to the button element in Row.svelte?
			// { key: ' ', modifier: 'shift', preventDefault: true, callback: () => explorerStore.select(node, e.ctrlKey || e.metaKey, e.shiftKey) },
			{
				key: 'Escape',
				modifier: false,
				preventDefault: true,
				callback: () => {
					explorerStore.clearSelection();
					explorerStore.clearFocus();
					explorerElement?.focus();
				}
			},
			{ key: 'ArrowDown', modifier: false, preventDefault: true, callback: () => explorerStore.focusNext() },
			{
				key: 'ArrowDown',
				modifier: 'ctrl',
				preventDefault: true,
				callback: () => explorerElement?.scrollBy({ top: 8 })
			},
			{ key: 'ArrowUp', modifier: false, preventDefault: true, callback: () => explorerStore.focusPrev() },
			{
				key: 'ArrowUp',
				modifier: 'ctrl',
				preventDefault: true,
				callback: () => explorerElement?.scrollBy({ top: -8 })
			},
			{ key: 'ArrowRight', modifier: false, preventDefault: true, callback: () => explorerStore.expandFocused() },
			{ key: 'ArrowLeft', modifier: false, preventDefault: true, callback: () => explorerStore.collapseFocused() },
			{ key: 'Home', modifier: false, preventDefault: true, callback: () => explorerStore.focusFirst() },
			{ key: 'End', modifier: false, preventDefault: true, callback: () => explorerStore.focusLast() },
			{ key: 'F2', modifier: false, preventDefault: true, callback: () => explorerStore.startRename() },
			{ key: 'z', modifier: 'ctrl', preventDefault: true, callback: () => explorerStore.undo() },
			{ key: 'y', modifier: 'ctrl', preventDefault: true, callback: () => explorerStore.redo() }
		]
	});
</script>

<!-- MARKUP -->
<header class="bg-base-400 sticky top-0 flex min-h-10 items-center pl-3 text-xs whitespace-nowrap select-none">
	<div class="flex flex-1">EXPLORER</div>
	<div class="flex gap-1 pr-3">
		<button
			class="btn btn-square btn-ghost btn-xs btn-base-content tooltip tooltip-bottom z-100 rounded-none"
			data-tip="Expand All Folders"
		>
			<CopyPlusIcon class="size-5" />
		</button>
		<button
			class="btn btn-square btn-ghost btn-xs btn-base-content tooltip tooltip-bottom z-100 rounded-none"
			data-tip="Collapse All Folders"
		>
			<CopyMinusIcon class="size-5" />
		</button>
	</div>
</header>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={explorerElement}
	role="tree"
	tabindex="0"
	id="explorer"
	aria-multiselectable="true"
	class="bg-base-200 h-full overflow-y-auto outline-none"
	onclick={handleClick}
	onfocusin={handleFocusGained}
	onfocusout={handleFocusLost}
	use:shortcut={shortcuts}
>
	{#each explorerStore.visibleRows as { node, depth } (node.path)}
		<Row {node} {depth} />
	{/each}
</div>
<footer class="bg-base-400 sticky top-0 flex min-h-10 items-center px-3 whitespace-nowrap select-none">
	<label class="input input-xs input-secondary input-ghost bg-base-200 inset-ring-base-100 flex-1 inset-ring-1">
		<span class="label text-secondary text-sm"><SearchIcon class="size-4" />Search</span>
		<input type="text" class="text-base" />
	</label>
	<div class="ml-12">Selected: {explorerStore.selectedCount}</div>
</footer>

<!-- STYLE -->
<style>
</style>
