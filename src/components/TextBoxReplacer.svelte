<script lang="ts">
	import TextBox from '$components/TextBox.svelte';
	import { stringReplace } from '$lib/stringReplace';

	let input = $state('Input your text here');
	let output = $state('');

	let sharedClass = 'bg-white h-[90%] w-[45%] border-black border-5 rounded-md';

	const replacer = {
		shit: 'drattles',
		damn: 'drikes'
	};

	const formatText = () => {
		output = stringReplace(input, replacer);
	};
</script>

<div class="flex items-center justify-center flex-col w-4/5 h-9/10 mx-auto">
	<h1 class="text-3xl grow-1 flex items-center">compliance</h1>
	<button
		class="border-3 border-black rounded-md w-24 hover:scale-110 transition"
		onclick={formatText}>format</button
	>
	<div class="flex flex-row justify-evenly items-center grow-4 w-full">
		<TextBox bind:value={input} class={`${sharedClass} hover:scale-101 transition`} />
		<TextBox value={output} class={`${sharedClass} readonly`} />
	</div>
</div>
