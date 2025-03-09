<script lang="ts">
	import type { Snippet } from 'svelte';
	import FileInput from './FileInput.svelte';

	let {
		children: child,
		class: className
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class="flex flex-col {className}">
	<FileInput class="h-8" labelText="File Input:" />
	<div class="h-1 bg-black"></div>

	{@render child()}
</div>
