<script lang="ts">
	let { value = $bindable(), readonly = false, class: className = '', ...props } = $props();

	const finalClass = `${className} resize-none`;
</script>

{#if readonly === true}
	<p class={finalClass}>{value}</p>
{:else}
	<textarea class={finalClass} bind:value></textarea>
{/if}
