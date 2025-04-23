<script lang="ts">
  import {
    attemptReplacerUpdate,
    replacer,
    resetReplacer,
  } from "$lib/state/replacer.svelte";

  type Props = {
    class: string;
  };

  const { class: className }: Props = $props();

  let replacerString: string = $state(
    JSON.stringify(Object.fromEntries(replacer), null, 2),
  );

  const setAsReplacer = () => {
    try {
      attemptReplacerUpdate(replacerString);
    } catch (e) {
      console.error(`bad replacer json: ${e}`);
      // resetReplacer();
    }
  };
</script>

<div class={`${className} flex flex-col`}>
  <svelte:boundary>
    <button class="basis-8" onclick={setAsReplacer}>Set as replacer</button>
    <textarea bind:value={replacerString} class="w-full h-full"></textarea>
    {#snippet failed(error, reset)}
      <button class="basis-16" onclick={reset}>
        Tried to set bad replacer JSON: {error}. Click here to reset.
      </button>
    {/snippet}
  </svelte:boundary>
</div>
