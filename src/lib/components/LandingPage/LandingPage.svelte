<!-- SCRIPT -->
<script lang="ts">
	import { Pane, PaneGroup } from 'paneforge';
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import {
		SettingsIcon,
		PackagePlusIcon,
		FolderOpenIcon,
		LinkIcon,
		CodeIcon,
		BugIcon,
		MessageSquareTextIcon,
		InfoIcon
	} from '@lucide/svelte';
	import NewProjectModal from '$lib/components/LandingPage/NewProjectModal.svelte';
	import AlphaWarningModal from '$lib/components/LandingPage/AlphaWarningModal.svelte';
	import { onMount } from 'svelte';

	let newProjectDialog = $state<HTMLDialogElement>();
	let alphaWarningDialog = $state<HTMLDialogElement>();

	onMount(() => {
		/* TODO: CHECK DO NOT SHOW AGAIN CHECKBOX SETTING AND IF CHECKED, DON'T OPEN WARNING DIALOG.
				 ALSO CHECK IF THIS IS AN ALPHA BUILD, IF NOT DON'T OPEN WARNING DIALOG. */
		alphaWarningDialog?.showModal();
		alphaWarningDialog?.blur();
	});
</script>

<!-- MARKUP -->
<NewProjectModal bind:dialog={newProjectDialog} />
<AlphaWarningModal bind:dialog={alphaWarningDialog} />

<div class="bg-base-400 flex h-screen w-full items-center justify-center select-none">
	<div
		class="card bg-base-300 ring-base-100 h-full max-h-250 w-full max-w-300 shadow-[0_0_0.5rem_0.1rem] ring-2 shadow-black/20"
	>
		<div class="class-body h-full w-full">
			<PaneGroup direction="vertical">
				<Pane defaultSize={10} class="flex items-center justify-between pr-8 pl-8">
					<div>
						<span class="text-3xl font-bold">Crochet</span>
						<button class="ml-4 cursor-pointer" onclick={() => alphaWarningDialog?.showModal()}>
							<div class="badge badge-soft badge-warning -translate-y-1">
								<InfoIcon class="size-[1em]" strokeWidth={3} />
								<span class="text-base font-bold">v1.0.0-ALPHA.1</span>
							</div>
						</button>
					</div>

					<button class="btn btn-soft btn-info"><SettingsIcon class="size-5 text-base" />Settings</button>
				</Pane>
				<Pane defaultSize={90}>
					<PaneGroup direction="horizontal" class="bg-base-100">
						<Pane defaultSize={25}>
							<PaneGroup direction="vertical" class="bg-base-200">
								<Pane defaultSize={33} class="border-neutral flex flex-col border-t p-8">
									<h2 class="card-title">Start</h2>
									<div class="flex flex-1 flex-col justify-center gap-2">
										<button class="btn btn-block btn-primary" onclick={() => newProjectDialog?.showModal()}>
											<PackagePlusIcon class="size-5 text-base" />New Project
										</button>
										<button class="btn btn-block btn-accent" onclick={projectStore.openExistingProject}>
											<FolderOpenIcon class="size-5 text-base" />Open Project
										</button>
									</div>
								</Pane>
								<Pane defaultSize={33} class="border-neutral flex flex-col border-t p-8">
									<h2 class="card-title">Reference</h2>
									<div class="flex flex-1 flex-col items-start justify-center gap-2">
										<a href={null}>
											<LinkIcon class="inline size-4" /> Getting Started
										</a>
										<a
											href="https://docs.yarnspinner.dev/write-yarn-scripts/scripting-fundamentals/lines-nodes-and-options"
											target="_blank"
											rel="noopener noreferrer"
										>
											<LinkIcon class="inline size-4" /> Yarn Spinner Docs
										</a>
										<a href="https://www.jujuadams.com/Chatterbox" target="_blank" rel="noopener noreferrer">
											<LinkIcon class="inline size-4" /> Chatterbox Docs
										</a>
									</div>
								</Pane>
								<Pane defaultSize={33} class="border-neutral flex flex-col border-t p-8">
									<h2 class="card-title">Community</h2>
									<div class="flex flex-1 flex-col items-start justify-center gap-2">
										<a href={null}>
											<CodeIcon class="inline size-4" /> GitHub
										</a>
										<a href={null}>
											<BugIcon class="inline size-4" /> Report a Bug
										</a>
										<a href={null}>
											<MessageSquareTextIcon class="inline size-4" /> Yarn Spinner Discord Server
										</a>
										<a href={null}>
											<MessageSquareTextIcon class="inline size-4" /> Chatterbox Discord Server
										</a>
									</div>
								</Pane>
							</PaneGroup>
						</Pane>
						<Pane defaultSize={75}>
							<PaneGroup direction="vertical" class="h-full">
								<Pane defaultSize={50} class="border-neutral flex flex-col border-t border-l p-8">
									<h2 class="card-title">Recent Projects</h2>
									<p>No Recent Projects...</p>
								</Pane>
								<Pane defaultSize={50} class="border-neutral flex flex-col border-t border-l p-8">
									<h2 class="card-title">Updates</h2>
									<p>No Updates...</p>
								</Pane>
							</PaneGroup>
						</Pane>
					</PaneGroup>
				</Pane>
				<footer class="footer border-neutral text-base-content/50 justify-end border-t pt-2 pr-4 pb-2">
					<a
						href="https://github.com/FaultyFunctions/Crochet/blob/main/LICENSE.md"
						target="_blank"
						rel="noopener noreferrer"
					>
						© {new Date().getFullYear()} FaultyFunctions. Licensed under the MIT License.
					</a>
				</footer>
			</PaneGroup>
		</div>
	</div>
</div>

<!-- STYLE -->
<style>
</style>
