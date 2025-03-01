<script lang="ts">
	import { userInput } from '$lib/state/userInput.svelte';

	interface Props {
		className: string | undefined;
	}

	let text = $state(userInput.text);
	let { className }: Props = $props();

	$effect(() => {
		userInput.text = text;
	});
</script>

<textarea class={`resize-none overflow-hidden ${className}`} bind:value={text}></textarea>
