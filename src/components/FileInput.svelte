<script lang="ts">
	let files: FileList | undefined = $state();

	let {
		labelText,
		class: className
	}: {
		labelText: string;
		class?: string;
	} = $props();

	const onUpload = () => {
		if (files === undefined) {
			return;
		}
	};

	/* is it better for this to be unchanging state or just generated every render? */
	const idName = $state('finput' + (Math.random() * 10e15).toString(16));
</script>

<div class={`flex flex-row ${className} gap-1`}>
	<label for={idName}>{labelText}</label>
	<!-- w-auto was necessary because otherwise this was taking up the whole width? i hate css... -->
	<input id={idName} type="file" bind:files onchange={onUpload} class="w-auto" />
</div>
