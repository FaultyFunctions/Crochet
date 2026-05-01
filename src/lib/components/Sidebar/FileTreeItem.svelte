<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { FileNode } from '$lib/types/fileTree';
	import FileTreeItem from './FileTreeItem.svelte';
	import { createDraggable, createDroppable } from '@dnd-kit/svelte';
	import { project } from '$lib/stores/projectStore.svelte';

	type Props = {
		node: FileNode;
		depth?: number;
	};

	let { node, depth = 0 }: Props = $props();
	const isOpen = $derived(project.expandedFolders.has(node.path));

	const draggable = createDraggable({
		get id() {
			return node.path;
		},
		type: 'file-node',
		get data() {
			return { node };
		}
	});

	const droppable = node.isDir
		? createDroppable({
				get id() {
					return `drop:${node.path}`;
				},
				type: 'folder',
				accept: 'file-node',
				get data() {
					return { node };
				},
				get disabled() {
					return draggable.isDragSource;
				}
			})
		: null;

	const handleToggle = (e: Event) => {
		const open = (e.currentTarget as HTMLDetailsElement).open;
		project.toggleFolder(node, open);
	};
</script>

<!-- # MARKUP # -->
{#if node.isDir}
	<li>
		<details open={isOpen} ontoggle={handleToggle}>
			<summary
				{@attach draggable.attach}
				{@attach droppable!.attach}
				class="flex items-center gap-1 after:hidden"
				class:opacity-40={draggable.isDragSource}
				class:bg-primary={droppable!.isDropTarget}
			>
				<span class="transition-transform duration-150" class:rotate-90={isOpen}>
					<Icon icon="pajamas:chevron-lg-right" />
				</span>
				<Icon icon={isOpen ? 'pajamas:folder-open' : 'pajamas:folder'} class="text-base-content/60" />
				{node.name}
			</summary>
			<ul>
				{#each node.children ?? [] as child (child.path)}
					<FileTreeItem node={child} depth={depth + 1} />
				{/each}
			</ul>
		</details>
	</li>
{:else}
	<li>
		<a {@attach draggable.attach} href={null} class="flex items-center gap-1" class:opacity-40={draggable.isDragSource}>
			<span class="w-3 shrink-0"></span>
			<Icon icon="pajamas:comment-dots" class="text-base-content/60" />
			{node.name}
		</a>
	</li>
{/if}
