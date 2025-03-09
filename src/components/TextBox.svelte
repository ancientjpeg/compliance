<script lang="ts">
	import { userInput } from '$lib/state/userInput.svelte';

	let text = $state(userInput.text);
	let { class: className }: { class?: string } = $props();

	$effect(() => {
		userInput.text = text;
	});
</script>

<textarea class={`resize-none overflow-hidden ${className}`} bind:value={text}></textarea>
