<!-- # SCRIPT # -->
<script lang="ts">
	import FileTreeItem from '$lib/components/Sidebar/FileTreeItem.svelte';
	import { project } from '$lib/stores/projectStore.svelte';
	import type { FileNode } from '$lib/types/fileTree';
	import { createDroppable, DragDropProvider } from '@dnd-kit/svelte';
	import type { DragEndEvent } from '@dnd-kit/abstract';

	type DraggableData = { node: FileNode };
	type DroppableData = { node: FileNode | null }; // null = project root

	const isDescendant = (ancestor: FileNode, candidatePath: string): boolean => {
		if (!ancestor.children) return false;
		return ancestor.children.some((c) => c.path === candidatePath || isDescendant(c, candidatePath));
	};

	const onDragEnd = (event: DragEndEvent) => {
		if (event.canceled) return;

		const source = event.operation.source?.data as DraggableData | undefined;
		const target = event.operation.target?.data as DroppableData | undefined;
		if (!source || !target) return;

		const sourceNode = source.node;
		const targetNode = target.node; // null = project root
		const targetPath = targetNode?.path ?? project.config!.path;

		// Prevent drops onto folders the node is already in
		const sourceParent = sourceNode.path.replace(/[/\\][^/\\]+$/, '');
		if (sourceParent === targetPath) return;

		// Prevent dropping folders onto itself or descendants
		if (targetNode && (targetNode.path === sourceNode.path || isDescendant(sourceNode, targetNode.path))) return;

		project.moveNode(sourceNode.path, targetPath);
	};
</script>

<!-- # MARKUP # -->
{#if project.fileTree.length === 0}
	<p class="text-base-content/40 text-xs p-4 select-none">No folder open</p>
{:else}
	<DragDropProvider {onDragEnd}>
		{@const rootDroppable = createDroppable({
			id: '__root__',
			type: 'folder',
			accept: 'file-node',
			data: { node: null } as DroppableData
		})}
		<ul {@attach rootDroppable.attach} class="menu bg-base-200 w-full p-0" class:ring-1={rootDroppable.isDropTarget}>
			{#if project.fileTree.length === 0}
				<li class="text-base-content/40 text-xs p-4 select-none">No folder open</li>
			{:else}
				{#each project.fileTree as node (node.path)}
					<FileTreeItem {node} />
				{/each}
			{/if}
		</ul>
	</DragDropProvider>
{/if}
