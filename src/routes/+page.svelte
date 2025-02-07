<script lang="ts">
	import TextBox from '$components/TextBox.svelte';
</script>

<p style="text-3xl font-bold underline">hi</p>
<TextBox></TextBox>

<style>
	@reference "tailwindcss/theme";
	:global(html) {
		background-color: theme(--color-gray-100);
	}

	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
