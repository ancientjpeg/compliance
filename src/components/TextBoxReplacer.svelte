<script lang="ts">
	import type { Terms } from '$lib/stringReplace';
	import TextBox from '$components/TextBox.svelte';
	import { stringReplace } from '$lib/stringReplace';

	let input = $state('Input your text here');

	let { replacer = $bindable<Terms>(), class: className = '' } = $props();

	let sharedClass = 'bg-white h-[90%] w-[45%] border-black border-4 rounded-md';

	let output = $derived(stringReplace(input, replacer as Terms));
</script>

<div class={`flex flex-row justify-evenly items-center ${className}`}>
	<TextBox bind:value={input} class={`${sharedClass} hover:scale-101 transition`} />
	<TextBox value={output} readonly={true} class={sharedClass} />
</div>
