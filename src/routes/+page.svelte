<script lang="ts">
	import TextBoxReplacer from '$components/TextBoxReplacer.svelte';
	import defaultReplacer from '$lib/defaultReplacer';
	let replacer = $state(defaultReplacer);
	let showPopup = $state(false);
	const togglePopup = () => {
		showPopup = !showPopup;
	};
</script>

<div class="flex items-center justify-center flex-col w-4/5 h-9/10">
	<h1 class="text-xl grow-1 flex items-center">compliance</h1>
	<div class="grow-1">
		<button
			class="h-12 w-72 border-black border-3 rounded-lg hover:bg-gray-50"
			onclick={togglePopup}>{(showPopup ? 'Hide' : 'Show') + ' replacement list'}</button
		>
	</div>
	<div class="grow-4 w-full">
		{#if showPopup}
			<div class="">!!!!</div>
		{:else}
			<TextBoxReplacer bind:replacer class="" />
		{/if}
	</div>
</div>
