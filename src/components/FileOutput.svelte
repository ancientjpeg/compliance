<script lang="ts">
	import { DocFile } from '$lib/parse/docxIO';
	import { type UserData } from '$lib/state/userInput.svelte';
	import { type Action } from 'svelte/action';

	const {
		data,
		class: className,
		activeClass: inactiveClass
	}: { data: UserData; class?: string; activeClass?: string } = $props();

	let blobPromise: Promise<Blob> = $derived.by(async () => {
		const t = await data.text;
		if (t instanceof DocFile) {
			return await t.getDataAsZip();
		} else {
			return new Blob([t], { type: 'text/plain' });
		}
	});

	let hrefPromise: Promise<string> = $derived.by(async () => {
		return URL.createObjectURL(await blobPromise);
	});

	const linkLoad: Action<HTMLAnchorElement, string> = (_, data) => {
		$effect(() => {
			return () => {
				const href = data;
				if (href) {
					URL.revokeObjectURL(href);
				}
			};
		});
	};
</script>

{#await hrefPromise}
	<div class={inactiveClass}>Waiting For Input...</div>
{:then href}
	<a use:linkLoad={href} {href} download={data.filename} class={className}>
		Download {data.filename}
	</a>
{:catch err}
	<div class={inactiveClass}>Got error preparing download: {err}</div>
{/await}
