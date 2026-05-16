<!-- SCRIPT -->
<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<!-- MARKUP -->
<div class="h-screen w-screen">
	{@render children()}
</div>

<!-- STYLE -->
<style>
</style>
