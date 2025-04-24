<script lang="ts">
  import type { Replacer } from "$lib/state/replacer";
  import {
    attemptReplacerUpdate,
    createReplacerFromText,
    replacer,
    resetReplacer,
  } from "$lib/state/replacer.svelte";

  import Button from "./atoms/Button.svelte";
  import ReplacerBox from "./ReplacerBox.svelte";

  type Props = {
    class: string;
  };

  const { class: className }: Props = $props();

  const getReplacerString = () =>
    JSON.stringify(Object.fromEntries(replacer), null, 2);

  let replacerString: string = $state(getReplacerString());

  const validatedReplacer = $derived.by((): Replacer | null => {
    try {
      return createReplacerFromText(replacerString);
    } catch {}
    return null;
  });

  const valid = $derived(validatedReplacer !== null);
  const bg = $derived(valid ? "" : "bg-red-100");
  const setterText = $derived(valid ? "set as replacer" : "cannot be parsed!");
  const disabled = $derived(!valid);

  const onclick = () => {
    try {
      attemptReplacerUpdate(replacerString);
    } catch (e) {
      console.error(
        `state malfunction: should not attempt to parse bad replacer text! ${e}`,
      );
      throw e;
    }
  };

  const resetText = () => {
    replacerString = getReplacerString();
  };

  const resetReplacerAndText = () => {
    resetReplacer();
    resetText();
  };
</script>

<div class={`${className} flex justify-center items-center`}>
  <ReplacerBox class={`w-4/5 h-4/5 sm:w-lg md:w-2xl lg:w-4xl xl:w-6xl`}>
    {#snippet button(style: string)}
      <div
        id="button-row"
        class={`basis-14 
        sm:basis-10 
        flex justify-around overflow-hidden ${style}`}
      >
        <Button
          class="grow-1 border-r-2 border-black"
          onclick={resetReplacerAndText}
        >
          reset replacer
        </Button>
        <Button class="grow-1 border-r-2 border-black" onclick={resetText}>
          reset text
        </Button>
        <Button class="grow-1" {disabled} {onclick}>{setterText}</Button>
      </div>
    {/snippet}
    {#snippet textarea(style: string)}
      <textarea
        bind:value={replacerString}
        class={`w-full h-full resize-none ${bg} p-4`}
      ></textarea>
    {/snippet}
  </ReplacerBox>
</div>
