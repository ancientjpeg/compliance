<script lang="ts">
  import type { UserData } from "$lib/state/userInput.svelte";
  import { isDoc } from "$lib/state/UserIO";
  import type { Snippet } from "svelte";

  type Props = {
    button: Snippet<[string]>;
    textarea: Snippet;
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

<div class={`${className} bg-green-500`}>
  <!-- <button onclick={buttonAction}>{buttonText}</button> -->
  <!-- <textarea {disabled} bind:value={bindableText}></textarea> -->
  {@render button("bg-red-500")}
</div>
