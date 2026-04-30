<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { FileNode } from '$lib/types/fileTree';
	import FileTreeItem from './FileTreeItem.svelte';

	type Props = {
		node: FileNode;
		depth?: number;
	};

	let { node, depth = 0 }: Props = $props();
	let isOpen = $state(false);

	// async function handleToggle(e: Event) {
	// 	const details = e.target as HTMLDetailsElement;
	// 	if (details.open) {
	// 		await projectStore.expandNode(node);
	// 	}
	// 	isOpen = details.open;
	// }
</script>

<!-- # MARKUP # -->
{#if node.isDir}
	<li>
		<details>
			<summary class="flex items-center gap-1 after:hidden">
				<Icon icon="pajamas:chevron-lg-right" class="transition-transform duration-150 in-[[open]]:rotate-90" />
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
		<!-- svelte-ignore a11y_missing_attribute -->
		<a class="flex items-center gap-1">
			<span class="w-3 shrink-0"></span>
			<Icon icon="pajamas:comment-dots" class="text-base-content/60" />
			{node.name}
		</a>
	</li>
{/if}
