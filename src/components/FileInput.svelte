<script lang="ts">
	let files: FileList | undefined = $state();

	import { userInput } from '$lib/state/userInput.svelte';

	let {
		onFilesChanged,
		labelText,
		class: className
	}: {
		onFilesChanged: (files: FileList) => void;
		labelText?: string;
		class?: string;
	} = $props();

	const onUpload = () => {
		if (files === undefined) {
			return;
		}

		onFilesChanged(files);
	};

	if (!labelText) {
		labelText = 'Select File...';
	}

	/* is it better for this to be unchanging state or just generated every render? */
	const idName = $state('finput' + (Math.random() * 10e15).toString(16));
</script>

<div class={`flex flex-row ${className} gap-1 items-center justify-around`}>
	<label for={idName} class="grow-1 text-center hover:bg-gray-200">{labelText}</label>
	<input id={idName} type="file" bind:files onchange={onUpload} class="hidden" />
</div>
