<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    onclick?: () => void;
    class?: string;
    disabled?: boolean;
  };

  const { children, onclick, class: className, disabled }: Props = $props();
</script>

<button
  {disabled}
  {onclick}
  class={`basis-8 flex justify-center items-center 
  text-black disabled:text-gray-400 
  ${disabled ? "" : "active:bg-gray-400 hover:bg-gray-200"}
  ${className}`}
>
  {@render children?.()}
</button>
