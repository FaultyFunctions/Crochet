<script lang="ts">
	import { Tree, TreeItem, VirtualList } from 'svelte-file-tree';
	import { SvelteSet } from 'svelte/reactivity';
	import Icon from '@iconify/svelte';
	import { projectStore } from '$lib/stores/projectStore.svelte';

	const ITEM_HEIGHT = 28;
	const expandedIDs = new SvelteSet<string>();
	let selectedIDs = new SvelteSet<string>();

	let draggedID = $state<string | undefined>(undefined);
	let dropDestinationID = $state<string | undefined>(undefined);
	let tree = $state<Tree | null>(null);
</script>

{#if projectStore.fileTree.children.length === 0}
	<p class="text-base-content/40 text-xs p-4 select-none">No folder open</p>
{:else}
	<VirtualList
		ondragover={(e) => {
			e.preventDefault();
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		}}
		ondrop={(e) => {
			e.preventDefault();
			if (draggedID === undefined || tree === null) return;
			console.log('Tree Drop');
			// TODO: Make it so multiple items can be dragged and dropped
			// Should this be undefined?
			tree.move(new Set([draggedID]), undefined);
			// Reset IDs
			draggedID = undefined;
			dropDestinationID = undefined;
		}}
		estimateSize={() => ITEM_HEIGHT}
		class="h-full">
		{#snippet children({ treeSize, virtualItems })}
			<Tree
				bind:this={tree}
				root={projectStore.fileTree}
				expandedIds={expandedIDs}
				onMove={async ({ sources, destination }) => {
					const destPath = destination?.node.id ?? undefined;
					for (const source of sources) {
						console.log(source.node.id, destPath);
						await projectStore.moveFileNode(source.node.id, destPath);
					}
				}}
				class="relative w-full"
				style="height: {treeSize}px;">
				{#snippet children()}
					{#each virtualItems as { item, order, key, size, start } (key)}
						<TreeItem
							{item}
							{order}
							draggable
							onpointerdown={(e) => {
								e.stopPropagation();
								expandedIDs.has(item.node.id) ? expandedIDs.delete(item.node.id) : expandedIDs.add(item.node.id);
							}}
							title={item.node.id}
							data-drop-destination={dropDestinationID === item.node.id ? true : undefined}
							ondragstart={(e) => {
								// TODO: Make it so multiple items can be dragged and dropped
								draggedID = item.node.id;

								if (e.dataTransfer) {
									e.dataTransfer.effectAllowed = 'move';
									e.dataTransfer.dropEffect = 'move';
								}
							}}
							ondragend={() => {
								// Cleanup
								draggedID = undefined;
								dropDestinationID = undefined;
							}}
							ondragover={(e) => {
								e.preventDefault();
								if (draggedID === undefined || draggedID === item.node.id) return;

								// If file is target, use parent folder
								const dest = item.node.type === 'folder' ? item : item.parent;

								// Prevent folder from dropping onto itself or children
								for (let cur = dest; cur !== undefined; cur = cur.parent) {
									if (cur.node.id === draggedID) return;
								}

								dropDestinationID = dest?.node.id;
							}}
							ondragleave={(e) => {
								// Clear if we left the element and parent folder
								if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
								dropDestinationID = undefined;
							}}
							ondrop={(e) => {
								e.preventDefault();
								e.stopPropagation(); // Prevent Tree from firing ondrop
								if (draggedID === undefined || tree == null) return;
								const dest = item.node.type === 'folder' ? item : item.parent;

								// Expand folder
								if (dest?.node.type === 'folder' && !expandedIDs.has(dest.node.id)) expandedIDs.add(dest.node.id);
								// Update state and move items
								tree.move(selectedIDs.size ? new Set(selectedIDs) : draggedID ? new Set([draggedID]) : new Set(), dest);
								draggedID = undefined;
								dropDestinationID = undefined;
							}}
							class="absolute right-0 left-0 top-0 flex items-center gap-1 px-2
                                   cursor-pointer select-none text-sm
                                   hover:bg-base-200 aria-selected:bg-primary/20"
							style="height: {size}px; transform: translateY({start}px);
                                   padding-left: calc(0.5rem + {item.depth * 1}rem);">
							{#snippet children()}
								{#if item.node.type === 'folder'}
									<Icon
										icon="pajamas:chevron-lg-right"
										class="shrink-0 transition-transform duration-150 {item.expanded ? 'rotate-90' : ''}" />
									<Icon
										icon={item.expanded ? 'pajamas:folder-open' : 'pajamas:folder'}
										class="shrink-0 text-base-content/60" />
								{:else}
									<span class="w-4 shrink-0"></span>
									<Icon icon="pajamas:comment-dots" class="shrink-0 text-base-content/60" />
								{/if}
								<span class="truncate">{item.node.name}</span>
							{/snippet}
						</TreeItem>
					{/each}
				{/snippet}
			</Tree>
		{/snippet}
	</VirtualList>
{/if}
