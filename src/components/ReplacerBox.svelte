<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    /* takes active  and inactive styles */
    button: Snippet<[string]>;
    textarea: Snippet<[string]>;
    class?: string;
    disabled?: boolean;
  };

  let { button, textarea, class: className }: Props = $props();

  const buttonBaseStyle = "border-black border-b-2";
</script>

<div
  class={`${className} flex flex-col border-default rounded-default overflow-hidden`}
>
  {@render button(buttonBaseStyle)}
  {@render textarea(
    "grow-1 basis-0 overflow-scroll resize-none p-4 text-neutral-400 enabled:text-black outline-none",
  )}
</div>
