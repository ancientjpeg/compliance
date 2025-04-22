<script lang="ts">
  import type { UserData } from "$lib/state/userInput.svelte";
  import { isDoc } from "$lib/state/UserIO";
  import type { Snippet } from "svelte";

  type Props = {
    button: Snippet<[string]>;
    textarea: Snippet<[string]>;
    class?: string;
    disabled?: boolean;
  };

  let {
    button,
    textarea,
    class: className,
    disabled: isDisabled,
  }: Props = $props();

  const disabled = isDisabled;
</script>

<div class={`${className}`}>
  <!-- <button onclick={buttonAction}>{buttonText}</button> -->
  <!-- <textarea {disabled} bind:value={bindableText}></textarea> -->
  {@render button("bg-red-500")}
  {@render textarea(
    "grow-1 basis-0 overflow-scroll resize-none p-4 text-neutral-400 enabled:text-black",
  )}
</div>
