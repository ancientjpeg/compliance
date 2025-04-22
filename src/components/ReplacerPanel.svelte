<script lang="ts">
  import type { UserData } from "$lib/state/userInput.svelte";
  import ReplacerBox from "./ReplacerBox.svelte";

  type Props = {
    class: string;
  };

  let { class: className }: Props = $props();

  const sharedClass = "grow-0 basis-4/10 w-8/10 h-8/10";
</script>

<div
  class={`flex flex-col md:flex-row justify-evenly items-center content-center gap-4 ${className}`}
>
  <ReplacerBox class={sharedClass} buttonText="SelectFileToDownload">
    {#snippet button(style: string)}
      <div class={style}></div>
    {/snippet}
  </ReplacerBox>
  <!-- <ReplacerBox class={sharedClass}></ReplacerBox> -->
</div>
