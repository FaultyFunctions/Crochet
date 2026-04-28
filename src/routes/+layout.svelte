<!-- # SCRIPT # -->
<script>
	import '../app.css';
	let { children } = $props();
</script>

<!-- # MARKUP # -->
<div class="h-screen">
	{@render children()}
</div>
