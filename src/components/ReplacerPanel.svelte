<script lang="ts">
  import ReplacerBox from "./ReplacerBox.svelte";
  import DiffDisplay from "./DiffDisplay.svelte";

  import FileInput from "./FileInput.svelte";
  import { replacer } from "$lib/state/replacer.svelte";
  import { DocFile } from "$lib/parse/docxIO";
  import { isDoc, transformToOutput, updateUserInput } from "$lib/state/UserIO";
  import { userInput } from "$lib/state/userInput.svelte";
  import FileOutput from "./FileOutput.svelte";

  type Props = {
    class: string;
  };

  let { class: className }: Props = $props();

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

  const onFilesChanged = async (fileName: string, fileData: Blob) => {
    const ext = fileName.split(".").pop();
    let text: DocFile | string;
    if (ext == "docx") {
      text = await DocFile.createDocFile(fileData);
      updateUserInput({ kind: "doc", data: text, filename: fileName });
    } else {
      text = await fileData.text();
      updateUserInput({ kind: "text", data: text, filename: undefined });
    }
  };

  const output = $derived(
    transformToOutput(userInput.data, userInput.filename, replacer),
  );

  const disabled = $derived(isDoc(userInput));

  const boxClass = "grow-0 basis-4/10 w-8/10 h-8/10";
</script>

<div
  class={`flex flex-col md:flex-row justify-evenly items-center content-center gap-4 ${className}`}
>
  <ReplacerBox class={boxClass}>
    {#snippet button(style: string, _: string)}
      <FileInput class={style} {onFilesChanged} />
    {/snippet}
    {#snippet textarea(style: string)}
      <textarea {disabled} class={style} bind:value={getText, setText}>
      </textarea>
    {/snippet}
  </ReplacerBox>

  <ReplacerBox class={boxClass}>
    {#snippet button(style: string, inactiveStyle: string)}
      <FileOutput class={style} inactiveClass={inactiveStyle} data={output} />
    {/snippet}
    {#snippet textarea(style: string)}
      <DiffDisplay class={style} data={output} />
    {/snippet}
  </ReplacerBox>
</div>
