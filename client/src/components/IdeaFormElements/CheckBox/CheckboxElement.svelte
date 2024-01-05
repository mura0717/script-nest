<script>
  import { Label, Checkbox } from "flowbite-svelte";

  export let id;
  export let name;
  export let label;
  export let value;
  export let bindGroup;
  export let disabled;
</script>

<div>
  <Checkbox {id} {name} {label} {value} bind:group={bindGroup} {disabled} />
  <Label class="checkbox-element" for={id}>{label}</Label>
</div>
