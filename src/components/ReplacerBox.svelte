<script lang="ts">
  type Props = {
    class: string;
    buttonAction: () => void;
    buttonText: string;
    buttonPendingText?: string;
    textAreaEnabled?: boolean;
    stuff: string;
  };

  let {
    class: className,
    buttonAction,
    buttonText,
    buttonPendingText,
    textAreaEnabled,
    stuff = $bindable<string>(),
  }: Props = $props();
</script>

<div>
  <button onclick={buttonAction}>{buttonText}</button>
  <textarea disabled={!textAreaEnabled}> </textarea>
</div>
