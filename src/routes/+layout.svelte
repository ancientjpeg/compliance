<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="h-full w-screen absolute">
  {@render children?.()}
</div>

<style>
  :global(body) {
    box-sizing: border-box;
  }
</style>
