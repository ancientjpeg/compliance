<script lang="ts">
	import { defaultInput } from '$lib/state/userInput.svelte';
	import defaultReplacer from '$lib/defaultReplacer';
	import stringReplace from '$lib/stringReplace';
	import FileInput from './FileInput.svelte';
	import FileOutput from './FileOutput.svelte';

	import { userInput } from '$lib/state/userInput.svelte';
	let replacer = $state(defaultReplacer);

	let {
		isInput,
		class: className
	}: {
		isInput: boolean;
		class?: string;
	} = $props();

	const onFilesChanged = (fileText: string) => {
		userInput.text = fileText;
	};

	const defaultState = $derived(userInput.text == defaultInput);

	let output = $derived(
		defaultState ? 'Text will output here.' : stringReplace(userInput.text, replacer)
	);

	const buttonSharedStyle =
		'active:bg-gray-400 hover:bg-gray-200 h-8 flex justify-center items-center';
	const textBoxSharedStyle = 'grow-1 basis-0 overflow-scroll resize-none p-4';
</script>

<div
	class={`bg-white h-48 w-96 md:w-3/8 md:h-7/8 border-black border-4 rounded-default flex flex-col ${className} overflow-hidden`}
>
	{#if isInput}
		<FileInput class={buttonSharedStyle} {onFilesChanged} />
	{:else}
		<FileOutput class={buttonSharedStyle} text={output} />
	{/if}
	<div class="h-1 bg-black"></div>
	{#if isInput}
		<textarea class={textBoxSharedStyle} bind:value={userInput.text}></textarea>
	{:else}
		<p class={textBoxSharedStyle}>{output}</p>
	{/if}
</div>
