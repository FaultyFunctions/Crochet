<!-- # SCRIPT # -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Pane, PaneGroup } from 'paneforge';
	import { projectStore } from '$lib/stores/projectStore.svelte';
	import NewProjectModal from '$lib/components/LandingPage/NewProjectModal.svelte';

	let newProjectDialog = $state<HTMLDialogElement>();
</script>

<!-- # MARKUP # -->
<NewProjectModal bind:dialog={newProjectDialog} />

<div class="h-screen w-full flex items-center justify-center bg-base-300 select-none">
	<div
		class="card bg-base-300 max-w-300 max-h-250 w-full h-full shadow-[0_0_0.5rem_0.1rem] shadow-black/20 ring-2 ring-base-100">
		<div class="class-body h-full w-full">
			<PaneGroup direction="vertical">
				<Pane defaultSize={10} class="flex items-center justify-between pl-8 pr-8">
					<span class="text-2xl font-bold">Crochet <span class="badge badge-soft badge-info">v1.0.0</span></span>

					<button class="btn btn-soft btn-info"><Icon icon="pajamas:settings" class="text-base"></Icon>Settings</button>
				</Pane>
				<Pane defaultSize={90}>
					<PaneGroup direction="horizontal" class="bg-base-100">
						<Pane defaultSize={25}>
							<PaneGroup direction="vertical" class="bg-base-200">
								<Pane defaultSize={33} class="border-t border-neutral p-8 flex flex-col">
									<h2 class="card-title">Start</h2>
									<div class="flex flex-col justify-center gap-2 flex-1">
										<button class="btn btn-block btn-primary" onclick={() => newProjectDialog?.showModal()}
											><Icon icon="pajamas:issue-new" class="text-base"></Icon>New Project</button>
										<button class="btn btn-block btn-accent"
											><Icon icon="pajamas:folder-open" class="text-base"></Icon>Open Project</button>
									</div>
								</Pane>
								<Pane defaultSize={33} class="border-t border-neutral p-8 flex flex-col">
									<h2 class="card-title">Reference</h2>
									<div class="flex flex-col flex-1 justify-center items-start gap-2">
										<a href="#">
											<Icon icon="pajamas:link" class="inline"></Icon> Getting Started
										</a>
										<a href="https://www.jujuadams.com/Chatterbox" target="_blank">
											<Icon icon="pajamas:link" class="inline"></Icon> Chatterbox Docs
										</a>
										<a
											href="https://docs.yarnspinner.dev/write-yarn-scripts/scripting-fundamentals/lines-nodes-and-options"
											target="_blank">
											<Icon icon="pajamas:link" class="inline"></Icon> Yarn Spinner Docs
										</a>
									</div>
								</Pane>
								<Pane defaultSize={33} class="border-t border-neutral p-8 flex flex-col">
									<h2 class="card-title">Community</h2>
									<div class="flex flex-col flex-1 justify-center items-start gap-2">
										<a href="#">
											<Icon icon="pajamas:github" class="inline"></Icon> GitHub
										</a>
										<a href="#">
											<Icon icon="pajamas:bug" class="inline"></Icon> Report a Bug
										</a>
										<a href="#">
											<Icon icon="pajamas:discord" class="inline"></Icon> Chatterbox Discord Server
										</a>
										<a href="#">
											<Icon icon="pajamas:discord" class="inline"></Icon> Yarn Spinner Discord Server
										</a>
									</div>
								</Pane>
							</PaneGroup>
						</Pane>
						<Pane defaultSize={75}>
							<PaneGroup direction="vertical" class="h-full">
								<Pane defaultSize={50} class="border-t border-l border-neutral p-8 flex flex-col">
									<h2 class="card-title">Recent Projects</h2>
									<p>No Recent Projects...</p>
								</Pane>
								<Pane defaultSize={50} class="border-t border-l border-neutral p-8 flex flex-col">
									<h2 class="card-title">Updates</h2>
									<p>No Updates...</p>
								</Pane>
							</PaneGroup>
						</Pane>
					</PaneGroup>
				</Pane>
				<footer class="footer border-t border-neutral justify-end pb-2 pt-2 pr-4 text-base-content/50">
					<a href="https://github.com/FaultyFunctions/Crochet/blob/main/LICENSE.md" target="_blank"
						>© {new Date().getFullYear()} FaultyFunctions. Licensed under the MIT License.</a>
				</footer>
			</PaneGroup>
		</div>
	</div>
</div>
