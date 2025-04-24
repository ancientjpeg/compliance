<script lang="ts">
  import { DocFile } from "$lib/parse/docxIO";
  import { type UserDataOutput } from "$lib/state/UserIO";
  import { type Action } from "svelte/action";

  import Button from "./atoms/Button.svelte";

  type Props = {
    data: UserDataOutput | null;
    class: string;
  };

  const { data, class: className }: Props = $props();

  let blobPromise: Promise<Blob> = $derived.by(async () => {
    if (data === null) {
      return new Promise<Blob>(() => {});
    }

    const t = data.data;
    if (t instanceof DocFile) {
      return await t.getDataAsZip();
    } else {
      return new Blob([t], { type: "text/plain" });
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

  const fname = $derived(data?.filename ?? "");
</script>

{#snippet disabled(text: string)}
  <Button class={className} disabled={true}>{text}</Button>
{/snippet}

{#await hrefPromise}
  {@render disabled("Waiting For Input...")}
{:then href}
  <Button class={`cursor-pointer ${className}`}>
    <a use:linkLoad={href} {href} download={fname}>
      Download {fname}
    </a>
  </Button>
{:catch err}
  {@render disabled(`Got error preparing download: ${err}`)}
{/await}
