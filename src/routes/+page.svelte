<script lang="ts">
	import TextBox from '$components/TextBox.svelte';

	let input = $state('');
	let output = $state('');
</script>

<div class="flex items-center justify-center flex-col w-4/5 h-9/10 mx-auto">
	<h1 class="text-3xl grow-1 flex items-center">compliance</h1>
	<div class="grow-4 w-full bg-black">
		<TextBox bind:text={input} class="bg-white h-full w-1/2" />
		<TextBox text={output} class="bg-blue-500 h-full w-1/3" />
	</div>
</div>
