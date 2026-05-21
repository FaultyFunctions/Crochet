<!-- SCRIPT -->
<script lang="ts">
	import WorkspaceTabHolder from '$lib/components/Workspace/WorkspaceTabHolder.svelte';
	import {
		SvelteFlow,
		MiniMap,
		Controls,
		Background,
		type SvelteFlowProps,
		type MiniMapProps,
		type ControlsProps,
		ControlButton
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/base.css';
	import {
		AlignStartVerticalIcon,
		AlignEndVerticalIcon,
		AlignStartHorizontalIcon,
		AlignEndHorizontalIcon,
		ZoomInIcon,
		ZoomOutIcon
	} from '@lucide/svelte';

	const svelteFlowConfig: SvelteFlowProps = {
		nodesConnectable: false,
		attributionPosition: 'bottom-right',
		snapGrid: [20, 20],
		proOptions: { hideAttribution: true }
	};

	const miniMapProps: MiniMapProps = {
		position: 'top-right',
		bgColor: 'var(--color-base-100)',
		maskColor: 'var(--color-base-300)',
		maskStrokeColor: 'var(--color-primary)',
		maskStrokeWidth: 1,
		width: 196,
		height: 128
	};

	const defaultControlProps: ControlsProps = {
		position: 'bottom-right',
		orientation: 'vertical',
		class: 'bg-base-300 defaultControl',
		showZoom: false
	};

	const zoomControlProps: ControlsProps = {
		position: 'bottom-right',
		orientation: 'vertical',
		class: 'bg-base-300 -translate-y-20',
		showZoom: false,
		showFitView: false,
		showLock: false
	};

	const sortControlProps: ControlsProps = {
		position: 'bottom-right',
		orientation: 'horizontal',
		class: 'bg-base-300 -translate-x-12',
		showZoom: false,
		showFitView: false,
		showLock: false
	};

	let nodes = $state.raw([
		{ id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
		{ id: '2', position: { x: 0, y: 100 }, data: { label: '2' } }
	]);

	let edges = $state.raw([{ id: 'e1-2', source: '1', target: '2' }]);
</script>

<!-- MARKUP -->
<div id="workspace-container" class="flex h-full w-full flex-col">
	<WorkspaceTabHolder />
	<div class="flex-1">
		<SvelteFlow bind:nodes bind:edges {...svelteFlowConfig}>
			<Background bgColor="var(--color-base-100)" />
			<MiniMap {...miniMapProps} />
			<Controls {...sortControlProps}>
				<ControlButton title="Align Left" aria-label="Align Left">
					<AlignStartVerticalIcon />
				</ControlButton>
				<ControlButton title="Align Right" aria-label="Align Right">
					<AlignEndVerticalIcon />
				</ControlButton>
				<ControlButton title="Align Top" aria-label="Align Top">
					<AlignStartHorizontalIcon />
				</ControlButton>
				<ControlButton title="Align Bottom" aria-label="Align Bottom">
					<AlignEndHorizontalIcon />
				</ControlButton>
			</Controls>
			<Controls {...zoomControlProps}>
				<ControlButton title="Zoom In" aria-label="Zoom In">
					<ZoomInIcon class="fill-none!" />
				</ControlButton>
				<ControlButton title="Zoom Out" aria-label="Zoom Out">
					<ZoomOutIcon />
				</ControlButton>
			</Controls>
			<Controls {...defaultControlProps} />
		</SvelteFlow>
	</div>
	<WorkspaceTabHolder />
</div>

<!-- STYLE -->
<style>
	@reference "tailwindcss";

	:global(.svelte-flow__controls-button):hover {
		color: var(--color-primary);
		cursor: pointer;
	}

	:global(.svelte-flow__controls-button) {
		@apply size-10!;
	}

	:global(.svelte-flow__controls-button svg) {
		@apply size-6! max-h-none! max-w-none! fill-none!;
	}

	:global(.defaultControl .svelte-flow__controls-button svg) {
		@apply size-5! max-h-none! max-w-none! fill-current!;
	}
</style>
