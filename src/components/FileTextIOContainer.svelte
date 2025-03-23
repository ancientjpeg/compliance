<script lang="ts">
	import { userInput } from '$lib/state/userInput.svelte';
	import { transformToOutput } from '$lib/state/UserIO';
	import defaultReplacer from '$lib/defaultReplacer';
	import stringReplace from '$lib/stringReplace';
	import FileInput from './FileInput.svelte';
	import FileOutput from './FileOutput.svelte';
	import { DocFile } from '$lib/parse/docxIO';
	import { type UserData } from '$lib/state/userInput.svelte';

	let replacer = $state(defaultReplacer);

	let {
		isInput,
		class: className
	}: {
		isInput: boolean;
		class?: string;
	} = $props();

	const onFilesChanged = (fileName: string, fileData: Blob) => {
		const ext = fileName.split('.').pop();
		if (ext == 'docx') {
			userInput.text = DocFile.createDocFile(fileData);
		} else {
			userInput.text = fileData.text();
		}
		userInput.filename = fileName;
	};

	const userOutput = $derived.by(async () => await transformToOutput(userInput, defaultReplacer));

	const inputText: Promise<string> = $derived.by(async () => {
		const text = await userInput.text;
		if (text instanceof DocFile) {
			return await text.getText();
		}
		return text;
	});

	const inputMeta = $derived.by(async () =>
		Promise.all([(await userInput.text) instanceof DocFile, inputText])
	);

	/** TODO refactor this so the buttons have a shared class */
	const buttonInactiveStyle = 'h-8 flex justify-center items-center';
	const buttonSharedStyle = `${buttonInactiveStyle} active:bg-gray-400 hover:bg-gray-200`;
	const textBoxSharedStyle = 'grow-1 basis-0 overflow-scroll resize-none p-4';

	const onTextBoxChange = async (e: Event) => {
		const newText = (e.target as any).value;
		const t = await userInput.text;
		if (t instanceof DocFile) {
			console.error('IMPLEMENT DOC DIFFER!');
			return;
		} else {
			userInput.text = newText;
		}
	};
</script>

<div
	class={`bg-white h-48 w-96 md:w-3/8 md:h-7/8 border-black border-2 rounded-default flex flex-col ${className} overflow-hidden`}
>
	{#if isInput}
		<FileInput class={buttonSharedStyle} {onFilesChanged} />
	{:else}
		{#await userOutput then output}
			<FileOutput class={buttonSharedStyle} activeClass={buttonInactiveStyle} data={output} />
		{/await}
	{/if}
	<div class="h-0.5 bg-black"></div>
	{#if isInput}
		{#await inputMeta then meta}
			<textarea
				placeholder={'Input your text here.'}
				class={textBoxSharedStyle}
				oninput={onTextBoxChange}
				value={meta[1]}
				disabled={meta[0]}
			></textarea>
		{:catch err}
			<p class={textBoxSharedStyle}>Caught error: {err}</p>
		{/await}
	{:else}
		{#await userOutput then output}
			<p placeholder={'Text will output here.'} class={textBoxSharedStyle}>
				{#each output.diff as diffEntry}
					{#if diffEntry.isAdded}
						<span class="text-red-500">{diffEntry.text}</span>
					{:else}
						{diffEntry.text}
					{/if}
				{/each}
			</p>
		{/await}
	{/if}
</div>
