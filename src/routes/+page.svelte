<script lang="ts">
	import defaultReplacer from '$lib/defaultReplacer';
	let replacer = $state(defaultReplacer);
	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};

	import { stringReplace } from '$lib/stringReplace';

	const defaultInput = 'Input your text here.';
	let input = $state(defaultInput);

	const defaultState = $derived(input == defaultInput);

	const sharedClass = 'bg-white h-48 w-96 md:w-3/8 md:h-7/8 border-black border-4 rounded-lg';

	let output = $derived(defaultState ? 'Text will output here.' : stringReplace(input, replacer));
</script>

<div class="flex items-center justify-center flex-col w-full h-full">
	<h1 class="text-3xl grow-0 shrink-0 flex basis-36 items-center">compliance</h1>
	<div class="grow-1 basis-0 my-auto flex justify-center items-center">
		<button
			class="h-12 md:w-72 w-48 border-black border-4 rounded-lg hover:bg-gray-50"
			onclick={togglePopup}>{(showPopup ? 'Hide' : 'Show') + ' replacement list'}</button
		>
	</div>
	{#if showPopup}
		<div class="grow-6 w-full basis-0">!!!!</div>
	{:else}
		<div class="flex flex-col md:flex-row justify-evenly items-center grow-6 w-full basis-0">
			<textarea class={`resize-none overflow-hidden ${sharedClass}`} bind:value={input}></textarea>
			<p class={`resize-none overflow-hidden ${sharedClass}`}>{output}</p>
		</div>
	{/if}
</div>
