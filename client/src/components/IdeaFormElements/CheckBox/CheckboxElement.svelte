<script>
  import { Label, Checkbox } from "flowbite-svelte";

  export let id;
  export let label;
  export let value;
  export let bindGroup;
  export let disabled;
</script>

<div>
  <Checkbox {id} {label} {value} bind:group={bindGroup} {disabled} />
  <Label class="checkbox-element" for={id}>{label}</Label>
</div>
