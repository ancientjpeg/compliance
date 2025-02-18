<script lang="ts">
	let { value = $bindable(), readonly: readOnly = false, class: className = '' } = $props();

	const finalClass = `${className} resize-none overflow-hidden`;
</script>

{#if readOnly === true}
	<p class={finalClass}>{value}</p>
{:else}
	<textarea class={finalClass} bind:value></textarea>
{/if}
