<script lang="ts">
  import type { Replacer } from "$lib/state/replacer";
  import {
    attemptReplacerUpdate,
    createReplacerFromText,
    replacer,
    resetReplacer,
    ReplacerSyntaxError,
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

  const validatedReplacer: Replacer | Error = $derived.by(
    (): Replacer | Error => {
      try {
        return createReplacerFromText(replacerString);
      } catch (e) {
        if (e instanceof Error) {
          return e;
        }
        throw new Error("Got unexpected throw from createReplacerFromText");
      }
    },
  );

  const textForError = (e: Error) => {
    if (e instanceof ReplacerSyntaxError) {
      return `duplicate: ${e.key}:[${e.valueKey}:${e.value}]`;
    } else if (e instanceof SyntaxError) {
      return "JSON parse failed";
    }
    return "unknown error!";
  };

  const valid = $derived(!(validatedReplacer instanceof Error));
  const bg = $derived(valid ? "" : "bg-red-100");
  const errorText = $derived(
    valid ? "replacer valid!" : textForError(validatedReplacer as Error),
  );
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
        class={`basis-10 
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
        <Button class="grow-1" {disabled} {onclick}>set replacer</Button>
      </div>
    {/snippet}
    {#snippet textarea(style: string)}
      <div
        class={`basis-10 grow-0 border-b-2 border-black flex items-center justify-center ${bg}`}
      >
        {errorText}
      </div>
      <textarea bind:value={replacerString} class={style}></textarea>
    {/snippet}
  </ReplacerBox>
</div>
