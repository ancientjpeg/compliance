<script lang="ts">
	import FileTextIoContainer from '$components/FileTextIOContainer.svelte';

	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};
</script>

<div class="flex items-center justify-center flex-col w-95/100 h-95/100 border-4 border-black">
	<h1 class="text-3xl grow-0 shrink-0 flex basis-36 items-center">&#x2728 compliance &#x2728</h1>
	<!-- <div class="grow-1 basis-0 my-auto flex justify-center items-center">
		<button
			class="h-12 md:w-72 w-48 border-black border-4 rounded-default hover:bg-gray-50"
			onclick={togglePopup}>{(showPopup ? 'Hide' : 'Show') + ' replacement list'}</button
		>
	</div> -->
	<div class="flex flex-col md:flex-row justify-evenly items-center grow-6 w-full">
		{#if showPopup}
			<div class="grow-6">!!!!</div>
		{:else}
			{#each [true, false] as isInput}
				<FileTextIoContainer {isInput} />
			{/each}
		{/if}
	</div>
</div>
