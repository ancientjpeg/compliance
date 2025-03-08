<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-screen flex justify-center items-center">
	{@render children()}
</div>

<style>
	:global(body) {
		box-sizing: border-box;
	}
</style>
