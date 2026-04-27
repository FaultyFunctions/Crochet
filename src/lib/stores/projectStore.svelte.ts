import { invoke } from '@tauri-apps/api/core';
import type { FileNode } from '$lib/types/fileTree';

let projectPath = $state<string | null>(null);
let fileTree = $state<FileNode[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);
let directoryName = $derived(projectPath ? projectPath.split(/[\\/]/).at(-1) ?? null : null)

async function selectDirectory(): Promise<string | null> {
    return await invoke<string | null>('select_directory');
}

async function loadProject(path: string): Promise<void> {
    projectPath = path;
    fileTree = await invoke<FileNode[]>('read_directory', { path });
}

async function openProject(): Promise<void> {
    loading = true;
    error = null;
    try {
        const selected = await invoke<string | null>('select_directory');
        if (selected === null) return; // user cancelled
        projectPath = selected;
        fileTree = await invoke<FileNode[]>('read_directory', { path: selected });
    } catch (e) {
        error = String(e);
    } finally {
        loading = false;
    }
}

/** Lazily loads children for a folder node when it's expanded. */
async function expandNode(node: FileNode): Promise<void> {
    if (!node.isDir || (node.children && node.children.length > 0)) return;
    try {
        const children = await invoke<FileNode[]>('read_directory', { path: node.path });
        node.children = children;
    } catch (e) {
        error = String(e);
    }
}

export const projectStore = {
    get projectPath() { return projectPath; },
    get fileTree() { return fileTree; },
    get directoryName() { return directoryName; },
    // get loading() { return loading; },
    // get error() { return error; },
	openProject,
    selectDirectory,
    loadProject,
    expandNode
};