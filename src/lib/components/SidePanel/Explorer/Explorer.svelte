<!-- SCRIPT -->
<script lang="ts">
	import Row from '$lib/components/SidePanel/Explorer/Row.svelte';
	import { explorerStore } from '$lib/stores/explorerStore.svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import { shortcut, type ShortcutParameter } from '@svelte-put/shortcut';

	let explorerElement = $state<HTMLDivElement | undefined>();

	const handleClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			explorerStore.clearSelection();
			explorerStore.clearFocus();
		}
	};

	const shortcuts = $derived<ShortcutParameter>({
		enabled: !explorerStore.isAnyRenaming(),
		trigger: [
			{ key: 'Enter', modifier: false, preventDefault: true, callback: () => explorerStore.activateFocused() },
			{ key: ' ', modifier: false, preventDefault: true, callback: () => explorerStore.activateFocused() },
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
<header class="bg-base-500 sticky top-0 min-h-10 content-center pl-3 text-xs whitespace-nowrap select-none">
	<span>EXPLORER</span>
	EXPLORER - {projectStore.config?.name}
</header>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={explorerElement}
	role="tree"
	tabindex="0"
	id="explorer"
	aria-multiselectable="true"
	class="h-full overflow-y-auto outline-none"
	onclick={handleClick}
	onfocusout={(e: FocusEvent) => {
		if (!explorerElement?.contains(e.relatedTarget as Node)) {
			explorerStore.clearFocus();
		}
	}}
	use:shortcut={shortcuts}
>
	{#each explorerStore.visibleRows as { node, depth } (node.path)}
		<Row {node} {depth} />
	{/each}
</div>

<!-- STYLE -->
<style>
</style>
