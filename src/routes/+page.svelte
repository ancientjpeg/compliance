<script lang="ts">
	import TextBoxReplacer from '$components/TextBoxReplacer.svelte';
	import defaultReplacer from '$lib/defaultReplacer';
	let replacer = $state(defaultReplacer);
</script>

<div class="flex items-center justify-center flex-col w-4/5 h-9/10 mx-auto">
	<h1 class="text-3xl grow-1 flex items-center">compliance</h1>
	<TextBoxReplacer bind:replacer class="grow-4 w-full" />
</div>
