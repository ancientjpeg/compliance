<script lang="ts">
  import ReplacerPanel from "$components/ReplacerPanel.svelte";
  import ReplacerEditor from "$components/ReplacerEditor.svelte";

  let showReplacerEditor = $state(false);

  const toggleReplacerEditor = () => {
    showReplacerEditor = !showReplacerEditor;
  };
</script>

<button
  onclick={toggleReplacerEditor}
  class="basis-4 border-default rounded-default hover:bg-gray-300 px-4 absolute right-0 top-.25"
  >{showReplacerEditor ? "Hide" : "Show"} replacer editor</button
>
<div
  class="grow-1 relative flex flex-col items-center justify-center m-4 sm:m-8 border-default rounded-default border-black box-border"
>
  <h1 class="text-3xl grow-1 flex basis-8 md:basis-12 items-center">
    &#x2728 compliance &#x2728
  </h1>
  {#if showReplacerEditor}
    <ReplacerEditor class="absolute bg-green-500 border-black inset-8" />
  {/if}
  <p class="grow-0 basis-0 w-3/4 text-center">
    is a text-replacement tool that scans your input text and replaces it using
    a pre-defined map of target and replacement words. The default replacement
    map is based on the <a
      class="inline underline"
      href="https://docs.google.com/document/d/13XyaXb4UVyWnsc8-HyBd8Byx-zyd5Nf4x5TTacQUfv0/edit?tab=t.0"
    >
      recently unveiled list of words banned by the NSF
    </a>.
  </p>
  <ReplacerPanel class="grow-6 w-full"></ReplacerPanel>
</div>
