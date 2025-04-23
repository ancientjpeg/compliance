<script lang="ts">
  import type { UserDataOutput } from "$lib/state/UserIO";
  import { DiffChunkOp } from "$lib/diff/diffTypes";

  type Props = {
    class: string;
    data: UserDataOutput | null;
  };

  let { class: className, data }: Props = $props();
</script>

<p placeholder={"Text will output here."} class={className}>
  {#if data !== null}
    {#each data.diff as diffEntry}
      {#if diffEntry.op == DiffChunkOp.Equal}
        {diffEntry.data}
      {:else if diffEntry.op == DiffChunkOp.Insert}
        <span class="text-green-500 bg-green-100">
          {diffEntry.data}
        </span>
      {:else if diffEntry.op == DiffChunkOp.Delete}
        <span class="text-red-500 bg-red-100">
          {diffEntry.data}
        </span>
      {/if}
    {/each}
  {/if}
</p>
