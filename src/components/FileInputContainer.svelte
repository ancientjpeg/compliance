<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}
	let { children: child, class: className }: Props = $props();
	$inspect(child, className);
</script>

<div class="flex {className}">
	{@render child()}
</div>
