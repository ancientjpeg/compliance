<script lang="ts">
	interface Props {
		text: string;
		className: string | undefined;
	}
	let { text = $bindable(), className }: Props = $props();
</script>

<textarea class={`resize-none overflow-hidden ${className}`} bind:value={text}></textarea>
