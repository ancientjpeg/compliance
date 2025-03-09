<script lang="ts">
	let files: FileList | undefined = $state();

	let {
		onFilesChanged,
		labelText,
		class: className
	}: {
		onFilesChanged: (fileText: string) => void;
		labelText?: string;
		class?: string;
	} = $props();

	if (!labelText) {
		labelText = 'Select File...';
	}

	/* refactor this... */
	let labelTextFinal = $state(labelText);

	/* is it better for this to be unchanging state or just generated every render? */
	const idName = $state('finput' + (Math.random() * 10e15).toString(16));

	const onUpload = () => {
		if (files === undefined || files.length === 0) {
			return;
		}

		const f = files[0];
		labelTextFinal = f.name;

		f.text().then((txt) => {
			onFilesChanged(txt);
		});
	};
</script>

<div class={`flex flex-row ${className} gap-1 items-center justify-around`}>
	<label for={idName} class="grow-1 text-center hover:bg-gray-200">{labelTextFinal}</label>
	<input id={idName} type="file" bind:files onchange={onUpload} class="hidden" />
</div>
