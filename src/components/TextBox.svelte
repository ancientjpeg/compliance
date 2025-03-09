<script lang="ts">
	import { userInput } from '$lib/state/userInput.svelte';

	let { class: className }: { class?: string } = $props();
</script>

<textarea class={`resize-none overflow-hidden ${className}`} bind:value={userInput.text}></textarea>
