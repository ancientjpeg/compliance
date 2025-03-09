<script lang="ts">
	import defaultReplacer from '$lib/defaultReplacer';
	import { defaultInput, userInput } from '$lib/state/userInput.svelte';
	import stringReplace from '$lib/stringReplace';

	import FileInputContainer from '$components/FileInputContainer.svelte';

	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};
</script>

<div class="flex items-center justify-center flex-col w-95/100 h-95/100 border-4 border-black">
	<h1 class="text-3xl grow-0 shrink-0 flex basis-36 items-center">compliance</h1>
	<div class="grow-1 basis-0 my-auto flex justify-center items-center">
		<button
			class="h-12 md:w-72 w-48 border-black border-4 rounded-lg hover:bg-gray-50"
			onclick={togglePopup}>{(showPopup ? 'Hide' : 'Show') + ' replacement list'}</button
		>
	</div>
	<div class="flex flex-col md:flex-row justify-evenly items-center grow-6 w-full basis-0">
		{#if showPopup}
			<div class="grow-6">!!!!</div>
		{:else}
			{#each [true, false] as isInput}
				<FileInputContainer {isInput} />
			{/each}
		{/if}
	</div>
</div>
