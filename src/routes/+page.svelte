<script lang="ts">
	import TextBoxReplacer from '$components/TextBoxReplacer.svelte';
	import defaultReplacer from '$lib/defaultReplacer';
	let replacer = $state(defaultReplacer);
	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};
</script>

<div class="flex items-center justify-center flex-col w-full h-full">
	<h1 class="text-3xl grow-0 shrink-0 flex basis-36 items-center">compliance</h1>
	<div class="grow-1 basis-0">
		<button
			class="h-12 md:w-72 w-48 border-black border-4 rounded-lg hover:bg-gray-50"
			onclick={togglePopup}>{(showPopup ? 'Hide' : 'Show') + ' replacement list'}</button
		>
	</div>
	{#if showPopup}
		<div class="grow-4 w-full basis-0">!!!!</div>
	{:else}
		<TextBoxReplacer bind:replacer class="grow-4 w-full basis-0" />
	{/if}
</div>
