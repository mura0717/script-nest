<script>
  import { Label, Radio } from "flowbite-svelte";
  import "./radio-button.css";

  export let id;
  export let name;
  export let label;
  export let value;
  export let selectedValue;
  export let onChange;
</script>

<div>
  <Radio {id} {name} {label} {value} checked={selectedValue === value} on:change={onChange} />
  <Label for={id}>{label}</Label>
</div>
