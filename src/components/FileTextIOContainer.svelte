<script lang="ts">
	import { defaultInput, userOutput, userInput, type UserText } from '$lib/state/userInput.svelte';
	import defaultReplacer from '$lib/defaultReplacer';
	import stringReplace from '$lib/stringReplace';
	import FileInput from './FileInput.svelte';
	import FileOutput from './FileOutput.svelte';
	import { DocFile } from '$lib/parse/docxIO';

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
		userOutput.text = stringReplace(userInput.text, replacer);
	};

	const output: Promise<UserText> = $derived.by(async () => {
		const t: UserText = await userInput.text;
		const replaced = await stringReplace(t, defaultReplacer);
		if (replaced instanceof DocFile) {
			return await replaced.getText();
		}
		return replaced;
	});

	/** TODO refactor this so the buttons have a shared class */
	const buttonInactiveStyle = 'h-8 flex justify-center items-center';
	const buttonSharedStyle = `${buttonInactiveStyle} active:bg-gray-400 hover:bg-gray-200`;
	const textBoxSharedStyle = 'grow-1 basis-0 overflow-scroll resize-none p-4';
</script>

<div
	class={`bg-white h-48 w-96 md:w-3/8 md:h-7/8 border-black border-4 rounded-default flex flex-col ${className} overflow-hidden`}
>
	{#await userInput.text}
		<p>Waiting for parse...</p>
	{:then text}
		{#if isInput}
			<FileInput class={buttonSharedStyle} {onFilesChanged} />
		{:else}
			<FileOutput class={buttonSharedStyle} activeClass={buttonInactiveStyle} data={userOutput} />
		{/if}
		<div class="h-1 bg-black"></div>
		{#if isInput}
			{#if userOutput.text instanceof DocFile}
				<p class={textBoxSharedStyle}>{text}</p>
			{:else}
				<textarea
					class={textBoxSharedStyle}
					oninput={(event: any) => {
						console.log(event);
					}}
				>
					{text}
				</textarea>
			{/if}
		{:else}
			{#await output then o}
				<p class={textBoxSharedStyle}>{o}</p>
			{/await}
		{/if}
	{:catch err}
		<p>Something went wrong: {err}</p>
	{/await}
</div>
