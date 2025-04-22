<script lang="ts">
  import ReplacerBox from "./ReplacerBox.svelte";
  import DiffDisplay from "./DiffDisplay.svelte";

  import { userInput } from "$lib/state/userInput.svelte";
  import { isDoc, transformToOutput, updateUserInput } from "$lib/state/UserIO";
  import defaultReplacer from "$lib/defaultReplacer";

  type Props = {
    class: string;
  };

  let { class: className }: Props = $props();

  const sharedClass = "grow-0 basis-4/10 w-8/10 h-8/10";

  const getText = () => {
    if (isDoc(userInput)) {
      return userInput.data.getText();
    } else {
      return userInput.data;
    }
  };

  const setText = (s: string) => {
    if (isDoc(userInput)) {
      console.error("State malfunction; trying to type into a docx entry!");
    } else {
      updateUserInput({
        kind: "text",
        data: s,
        filename: undefined,
      });
    }
  };

  const output = transformToOutput(userInput, defaultReplacer);

  const disabled = isDoc(userInput);
</script>

<div
  class={`flex flex-col md:flex-row justify-evenly items-center content-center gap-4 ${className}`}
>
  <ReplacerBox class={sharedClass}>
    {#snippet button(style: string)}
      <div class={style}>button</div>
    {/snippet}
    {#snippet textarea(style: string)}
      <textarea {disabled} class={style} bind:value={getText, setText}>
      </textarea>
    {/snippet}
  </ReplacerBox>

  <ReplacerBox class={sharedClass}>
    {#snippet button(style: string)}
      <div class={style}>button</div>
    {/snippet}
    {#snippet textarea(style: string)}
      <DiffDisplay class={style} data={output} />
    {/snippet}
  </ReplacerBox>
</div>
