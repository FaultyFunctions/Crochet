<!-- SCRIPT -->
<script lang="ts">
	import { SidePanelStatus, sidePanelStore } from '$lib/stores/sidePanelStore.svelte';
	import { on } from 'svelte/events';

	let isDragging = $state<boolean>(false);
	let startX = 0;
	let startWidth = 0;
	let removeMouseMove: (() => void) | null = null;
	let removeMouseUp: (() => void) | null = null;

	const handleMouseDown = (e: MouseEvent): void => {
		e.preventDefault();

		isDragging = true;
		startX = e.clientX;
		startWidth = sidePanelStore.status === SidePanelStatus.COLLAPSING ? 0 : sidePanelStore.getWidth();

		removeMouseMove = on(window, 'mousemove', handleMouseMove);
		removeMouseUp = on(window, 'mouseup', handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent): void => {
		sidePanelStore.setWidth(startWidth + (e.clientX - startX));
	};

	const handleMouseUp = (): void => {
		isDragging = false;
		removeMouseMove?.();
		removeMouseUp?.();

		removeMouseMove = null;
		removeMouseUp = null;
	};
</script>

<!-- MARKUP -->
<div
	class="bg-base-400 has-[:hover]:bg-secondary flex transition-colors delay-150 duration-250"
	class:bg-secondary={isDragging}
	class:bg-base-400={sidePanelStore.status === SidePanelStatus.COLLAPSED ||
		sidePanelStore.status === SidePanelStatus.EXPANDED}
>
	<button
		id="side-panel-sash"
		class="hover:bg-secondary data-[dragging=true]:bg-secondary bg-base-100 relative mt-10 w-1 cursor-ew-resize pb-10 transition-colors delay-150 duration-250"
		class:bg-base-400={sidePanelStore.status === SidePanelStatus.COLLAPSED}
		data-dragging={isDragging}
		aria-label="Resize Side Panel"
		onmousedown={handleMouseDown}
	></button>
</div>
{#if isDragging}
	<div id="side-panel-sash-drag-overlay" class="fixed inset-0 z-50 cursor-ew-resize select-none"></div>
{/if}

<!-- STYLE -->
<style>
	button {
		appearance: none;
		border: none;
		padding: 0;
	}
</style>
