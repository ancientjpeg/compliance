<script lang="ts">
	/*******************************************************/
	/* TODO this is fully ChatGPT code. Review and cleanup */
	/*******************************************************/

	const { text, class: className }: { text: string; class?: string } = $props();
	let filename = 'download.txt';

	function download() {
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<button class={className} onclick={download}>Download File</button>
