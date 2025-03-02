<script lang="ts">
	let fileList: FileList = $state(new FileList());

	const onUpload = () => {};
</script>

<input type="file" bind:files={fileList} onchange={onUpload} />
