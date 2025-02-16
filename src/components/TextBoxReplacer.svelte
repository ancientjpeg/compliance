<script lang="ts">
	import type { StringMap } from '$lib/stringReplace';
	import TextBox from '$components/TextBox.svelte';
	import { stringReplace } from '$lib/stringReplace';

	let input = $state('Input your text here');

	let { replacer = $bindable<StringMap>(), class: className = '' } = $props();

	let sharedClass = 'bg-white h-48 w-96 border-black border-4 rounded-md';

	let output = $derived(stringReplace(input, replacer));
</script>

<div class={`flex flex-row justify-evenly items-center ${className}`}>
	<TextBox bind:value={input} class={`${sharedClass} hover:scale-101 transition`} />
	<TextBox value={output} readonly={true} class={sharedClass} />
</div>
