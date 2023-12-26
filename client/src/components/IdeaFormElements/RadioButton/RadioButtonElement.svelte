<script>
  import { Label, Radio } from "flowbite-svelte";
  import "./radio-button.css";

  export let id;
  export let name;
  export let label;
  export let value;
  export let bindGroup;
  export let disabled;
</script>

<div>
  <Radio {id} {name} {value} bind:group={bindGroup} {disabled} />
  <Label for={id}>{label}</Label>
</div>
