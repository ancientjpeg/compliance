<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-screen w-screen absolute flex">
	{@render children()}
</div>

<style>
	:global(body) {
		box-sizing: border-box;
	}
</style>
