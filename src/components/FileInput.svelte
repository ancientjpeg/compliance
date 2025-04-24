<script lang="ts">
  import Button from "./atoms/Button.svelte";

  let files: FileList | undefined = $state();

  let {
    onFilesChanged,
    class: className,
  }: {
    onFilesChanged: (fileName: string, fileText: File) => void;
    class?: string;
  } = $props();

  const defaultLabelText = "Select File...";
  let labelText = $state(defaultLabelText);

  /* is it better for this to be unchanging state or just generated every render? */
  const idName = $state("finput" + (Math.random() * 10e15).toString(16));

  const onUpload = () => {
    if (files === undefined || files.length === 0) {
      return;
    }

    const f = files[0];
    labelText = `File: ${f.name}`;

    onFilesChanged(f.name, f);
  };
</script>

<Button class={className}>
  <label class="w-full h-full flex flex-col justify-center" for={idName}
    >{labelText}</label
  >
  <input
    id={idName}
    type="file"
    bind:files
    onchange={onUpload}
    class="hidden"
  />
</Button>
