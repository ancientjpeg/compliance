<script lang="ts">
	let { text = $bindable(), class: className = '', ...props } = $props();
</script>

<input class={`${className}`} value={text} />
