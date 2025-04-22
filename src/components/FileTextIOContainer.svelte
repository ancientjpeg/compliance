<script lang="ts">
	import { userInput } from '$lib/state/userInput.svelte';
	import { transformToOutput, updateUserInput } from '$lib/state/UserIO';
	import defaultReplacer from '$lib/defaultReplacer';
	import FileInput from './FileInput.svelte';
	import FileOutput from './FileOutput.svelte';
	import { DocFile } from '$lib/parse/docxIO';
	import { DiffChunkOp } from '$lib/diff/diffTypes';

	let {
		isInput,
		class: className
	}: {
		isInput: boolean;
		class?: string;
	} = $props();

	const onFilesChanged = async (fileName: string, fileData: Blob) => {
		const ext = fileName.split('.').pop();
		let text: DocFile | string;
		if (ext == 'docx') {
			text = await DocFile.createDocFile(fileData);
		} else {
			text = await fileData.text();
		}
		updateUserInput(text, fileName);
	};

	const userOutput = $derived.by(async () => await transformToOutput(userInput, defaultReplacer));

	/** TODO refactor this so the buttons have a shared class */
	const buttonInactiveStyle = 'h-8 flex justify-center items-center';
	const buttonSharedStyle = `${buttonInactiveStyle} active:bg-gray-400 hover:bg-gray-200`;
	const textBoxSharedStyle = 'grow-1 basis-0 overflow-scroll resize-none p-4 text-neutral-400';
</script>

<div
	class={`bg-white border-black border-default rounded-default flex flex-col ${className} overflow-hidden`}
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
		<textarea
			placeholder={'Input your text here.'}
			class={`${textBoxSharedStyle} enabled:text-black`}
			bind:value={userInput.text}
			disabled={userInput.doc !== undefined}
		></textarea>
	{:else}
		<p placeholder={'Text will output here.'} class={textBoxSharedStyle}>
			{#await userOutput then output}
				{#if output !== null}
					{#each output.diff as diffEntry}
						{#if diffEntry.op == DiffChunkOp.Equal}
							{diffEntry.data}
						{:else if diffEntry.op == DiffChunkOp.Insert}
							<span class="text-green-500 bg-green-100">
								{diffEntry.data}
							</span>
						{:else if diffEntry.op == DiffChunkOp.Delete}
							<span class="text-red-500 bg-red-100">
								{diffEntry.data}
							</span>
						{/if}
					{/each}
				{/if}
			{/await}
		</p>
	{/if}
</div>
