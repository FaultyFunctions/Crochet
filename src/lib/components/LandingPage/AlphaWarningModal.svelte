<!-- SCRIPT -->
<script lang="ts">
	import { BugIcon, HardDriveUploadIcon, ShieldAlertIcon, ShieldOffIcon, TriangleAlertIcon } from '@lucide/svelte';

	type Props = {
		dialog?: HTMLDialogElement;
	};

	let { dialog = $bindable() }: Props = $props();

	const handleCancel = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
		}
	};
</script>

<!-- MARKUP -->
<dialog bind:this={dialog} class="modal" oncancel={(e) => e.preventDefault()} onkeydown={handleCancel}>
	<div class="modal-box ring-base-300 p-0 ring-6 select-none">
		<div class="bg-warning flex h-18 w-full items-center justify-between px-6">
			<div class="text-warning-content flex w-full items-center justify-center gap-4">
				<ShieldAlertIcon size="2rem" />
				<span class="text-2xl font-bold">Alpha Build Notice</span>
				<ShieldAlertIcon size="2rem" />
			</div>
		</div>
		<div role="alert" class="alert alert-warning alert-soft m-6">
			<TriangleAlertIcon />
			<span>Crochet is in active development. You may encounter bugs, unexpected behavior, or data loss.</span>
		</div>
		<div class="m-6">
			<p class="font-semibold">Before using Crochet to edit your existing projects, please read the following:</p>
			<ul class="mt-6 flex flex-col gap-6 text-sm">
				<li class="flex items-center gap-3">
					<HardDriveUploadIcon class="text-warning size-5 shrink-0" />
					<span>Back up your files to a safe location before using alpha builds of Crochet.</span>
				</li>
				<li class="flex items-center gap-3">
					<ShieldOffIcon class="text-warning size-5 shrink-0" />
					<span>Crochet is not responsible for any lost or corrupted data.</span>
				</li>
				<li class="flex items-center gap-3">
					<BugIcon class="text-warning size-5 shrink-0" />
					<span>Expect rough edges. Features may change, break, or disappear between updates without notice.</span>
				</li>
			</ul>
		</div>
		<div class="modal-action m-6 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<!-- TODO: SAVE THIS SETTING FOR LATER -->
				<input type="checkbox" class="checkbox checkbox-md checkbox-warning" />
				<span class="text-sm">Don't show this again.</span>
			</div>
			<form method="dialog">
				<!-- svelte-ignore a11y_autofocus -->
				<button class="btn btn-soft btn-success" autofocus>I Understand</button>
			</form>
		</div>
	</div>
</dialog>

<!-- STYLE -->
<style>
</style>
