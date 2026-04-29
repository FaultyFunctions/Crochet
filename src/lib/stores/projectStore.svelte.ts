import { invoke } from '@tauri-apps/api/core';
import { FileTree, FileNode as SFTFileNode, FolderNode as SFTFolderNode } from 'svelte-file-tree';
import type { FileNode } from '$lib/types/fileTree';

function convertNodes(nodes: FileNode[]): (SFTFileNode | SFTFolderNode)[] {
	return nodes.map((node) => {
		if (node.isDir) {
			return new SFTFolderNode({
				id: node.path,
				name: node.name,
				children: convertNodes(node.children ?? [])
			});
		}
		return new SFTFileNode({
			id: node.path,
			name: node.name
		});
	});
}

let projectPath = $state<string | null>(null);
let fileTree = $state(new FileTree<SFTFileNode | SFTFolderNode>([]));
// TODO: This will eventually be reassignable I think
// eslint-disable-next-line prefer-const
let directoryName = $derived(projectPath ? (projectPath.split(/[\\/]/).at(-1) ?? null) : null);

async function selectDirectory(): Promise<string | null> {
	return await invoke<string | null>('select_directory');
}

async function loadProject(path: string): Promise<void> {
	const nodes = await invoke<FileNode[]>('read_directory', { path });
	projectPath = path;
	fileTree = new FileTree(convertNodes(nodes));
}

async function openProject(): Promise<void> {
	const selected = await invoke<string | null>('select_directory');
	if (selected === null) return;
	const nodes = await invoke<FileNode[]>('read_directory', { path: selected });
	projectPath = selected;
	fileTree = new FileTree(convertNodes(nodes));
}

async function moveFileNode(sourcePath: string, destinationPath: string | undefined): Promise<void> {
	// destinationPath is null when dropping into root folder
	const destDir = destinationPath ?? projectPath!;
	await invoke('move_path', { source: sourcePath, destination: destDir });
	// Reload the file tree to reflect file system changes
	const nodes = await invoke<FileNode[]>('read_directory', { path: projectPath! });
	fileTree = new FileTree(convertNodes(nodes));
}

export const projectStore = {
	get projectPath() {
		return projectPath;
	},
	get fileTree() {
		return fileTree;
	},
	get directoryName() {
		return directoryName;
	},
	openProject,
	selectDirectory,
	loadProject,
	moveFileNode
};
