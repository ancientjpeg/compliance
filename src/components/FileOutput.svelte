<script lang="ts">
	const {
		text,
		filename,
		class: className,
		activeClass: inactiveClass
	}: { text?: string; filename?: string; class?: string; activeClass?: string } = $props();

	let download: string = $derived.by(() => {
		if (!filename) {
			return 'compliant_text.txt';
		} else {
			/** TODO handle multiple dots in filename */
			const [base, ext] = filename.split('.');
			return `${base}.compliant.${ext}`;
		}
	});

	let href: string | undefined = $state();

	$effect(() => {
		if (!text) {
			href = undefined;
			return;
		}

		const blob = new Blob([text], { type: 'text/plain' });
		href = URL.createObjectURL(blob);

		return () => {
			if (href) {
				URL.revokeObjectURL(href);
			}
		};
	});
</script>

{#if href}
	<a {href} {download} class={className}>Download {download}</a>
{:else}
	<div class={inactiveClass}>Waiting For Input...</div>
{/if}
