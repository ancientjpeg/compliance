<script lang="ts">
  import type { Replacer } from "$lib/state/replacer";
  import {
    attemptReplacerUpdate,
    createReplacerFromText,
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

  const validatedReplacer = $derived.by((): Replacer | null => {
    try {
      return createReplacerFromText(replacerString);
    } catch {}
    return null;
  });

  const valid = $derived(validatedReplacer !== null);
  const bg = $derived(valid ? "" : "bg-red-500");

  const setAsReplacer = () => {
    try {
      attemptReplacerUpdate(replacerString);
    } catch (e) {
      console.error(`bad replacer json: ${e}`);
      // resetReplacer();
    }
  };
</script>

<div class={`${className} ${bg} flex flex-col`}>
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
