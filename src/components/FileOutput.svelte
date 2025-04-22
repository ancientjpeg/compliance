<script lang="ts">
  import { DocFile } from "$lib/parse/docxIO";
  import { type UserDataOutput } from "$lib/state/UserIO";
  import { type Action } from "svelte/action";

  type Props = {
    data: UserDataOutput;
    class?: string;
    inactiveClass?: string;
  };

  const { data, class: className, inactiveClass }: Props = $props();

  let blobPromise: Promise<Blob> = $derived.by(async () => {
    if (data === null) {
      return new Promise<Blob>(() => {});
    }
    const t = data.text;
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
</script>

{#await hrefPromise}
  <div class={inactiveClass}>Waiting For Input...</div>
{:then href}
  <a use:linkLoad={href} {href} download={data!.filename} class={className}>
    Download {data!.filename}
  </a>
{:catch err}
  <div class={inactiveClass}>Got error preparing download: {err}</div>
{/await}
