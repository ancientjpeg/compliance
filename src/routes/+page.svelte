<script lang="ts">
	import defaultReplacer from '$lib/defaultReplacer';
	import { defaultInput, userInput } from '$lib/state/userInput.svelte';
	import stringReplace from '$lib/stringReplace';

	import FileInputContainer from '$components/FileInputContainer.svelte';
	import TextBox from '$components/TextBox.svelte';

	let replacer = $state(defaultReplacer);
	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};

	const defaultState = $derived(userInput.text == defaultInput);

	let output = $derived(
		defaultState ? 'Text will output here.' : stringReplace(userInput.text, replacer)
	);
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
			{#each [0, 1] as idx}
				<FileInputContainer
					class="bg-white h-48 w-96 md:w-3/8 md:h-7/8 border-black border-4 rounded-lg "
				>
					{#if idx == 0}
						<TextBox />
					{:else}
						<p class={`resize-none overflow-hidden`}>{output}</p>
					{/if}
				</FileInputContainer>
			{/each}
		{/if}
	</div>
</div>
