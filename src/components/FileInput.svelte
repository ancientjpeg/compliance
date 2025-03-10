<script lang="ts">
	let files: FileList | undefined = $state();

	let {
		onFilesChanged,
		class: className
	}: {
		onFilesChanged: (fileText: string) => void;
		class?: string;
	} = $props();

	const defaultLabelText = 'Select File...';
	let labelText = $state(defaultLabelText);

	/* is it better for this to be unchanging state or just generated every render? */
	const idName = $state('finput' + (Math.random() * 10e15).toString(16));

	const onUpload = () => {
		if (files === undefined || files.length === 0) {
			return;
		}

		const f = files[0];
		labelText = f.name;

		f.text().then((txt) => {
			onFilesChanged(txt);
		});
	};
</script>

<label class={className} for={idName}>{labelText}</label>
<input id={idName} type="file" bind:files onchange={onUpload} class="hidden" />
