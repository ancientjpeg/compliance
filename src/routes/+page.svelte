<script lang="ts">
	import FileTextIoContainer from '$components/FileTextIOContainer.svelte';

	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};
</script>

<div
	class="grow-1 flex items-center justify-center flex-col m-4 sm:m-8 border-2 rounded-default border-black box-border"
>
	<h1 class="text-3xl grow-1 flex basis-12 md:basis-18 items-center">&#x2728 compliance &#x2728</h1>
	<p class="grow-1 basis-0 w-3/4 text-center hidden md:block">
		is a text-replacement tool that scans your input text and replaces it using a pre-defined map of
		target and replacement words. The default replacement map is based on the <a
			class="inline underline"
			href="https://docs.google.com/document/d/13XyaXb4UVyWnsc8-HyBd8Byx-zyd5Nf4x5TTacQUfv0/edit?tab=t.0"
		>
			recently unveiled list of words banned by the NSF
		</a>.
	</p>
	<!-- <div class="grow-1 basis-0 my-auto flex justify-center items-center">
		<button
			class="h-12 md:w-72 w-48 border-black border-2 rounded-default hover:bg-gray-50"
			onclick={togglePopup}>{(showPopup ? 'Hide' : 'Show') + ' replacement list'}</button
		>
	</div> -->
	<div
		class="flex flex-col md:flex-row justify-evenly items-center content-center grow-6 w-full gap-4"
	>
		{#if showPopup}
			<div>!!!!</div>
		{:else}
			{#each [true, false] as isInput}
				<FileTextIoContainer class="grow-0 basis-4/10 w-8/10 h-8/10" {isInput} />
			{/each}
		{/if}
	</div>
</div>
