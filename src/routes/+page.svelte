<script lang="ts">
  import ReplacerPanel from "$components/ReplacerPanel.svelte";
  import ReplacerEditor from "$components/ReplacerEditor.svelte";
  import Button from "$components/atoms/Button.svelte";

  let showReplacerEditor = $state(false);

  const toggleReplacerEditor = () => {
    showReplacerEditor = !showReplacerEditor;
  };
</script>

<div
  class="absolute inset-4 sm:inset-8
  flex flex-col items-center justify-center
  border-default rounded-default border-black
  box-border overflow-hidden"
>
  <Button
    onclick={toggleReplacerEditor}
    class="border-b-2 sm:border-l-2 sm:rounded-bl-default 
    px-4 self-stretch sm:self-end sm:w-3xs "
  >
    {showReplacerEditor ? "hide" : "show"} replacer editor
  </Button>
  <h1 class="text-3xl grow-0 flex basis-18 sm:basis-24 items-center">
    &#x2728 compliance &#x2728
  </h1>
  <p class="grow-0 basis-18 sm:basis-24 w-3/4 text-center">
    {#if showReplacerEditor}
      in this menu, you can edit the JSON file that is used to scan your text
      for offending terms. Edit individual terms, or paste in JSON content!
      [File input coming soon]
    {:else}
      is a text-replacement tool that scans your input text and replaces it
      using a pre-defined map of target and replacement words. The default
      replacement map is based on the <a
        class="inline underline"
        href="https://docs.google.com/document/d/13XyaXb4UVyWnsc8-HyBd8Byx-zyd5Nf4x5TTacQUfv0/edit?tab=t.0"
      >
        recently unveiled list of words banned by the NSF
      </a>.
    {/if}
  </p>
  {#if showReplacerEditor}
    <ReplacerEditor class="grow-1 w-full" />
  {:else}
    <ReplacerPanel class="grow-1 w-full" />
  {/if}
</div>
