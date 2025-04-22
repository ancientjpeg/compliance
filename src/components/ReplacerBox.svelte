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

  const buttonInactiveStyle = "basis-8 flex justify-center items-center";
  const buttonSharedStyle = `${buttonInactiveStyle} active:bg-gray-400 hover:bg-gray-200`;
</script>

<div
  class={`${className} flex flex-col border-default rounded-default overflow-hidden`}
>
  {@render button(buttonSharedStyle)}
  <div class="basis-[var(--border-size)] bg-black"></div>
  {@render textarea(
    "grow-1 basis-0 overflow-scroll resize-none p-4 text-neutral-400 enabled:text-black",
  )}
</div>
