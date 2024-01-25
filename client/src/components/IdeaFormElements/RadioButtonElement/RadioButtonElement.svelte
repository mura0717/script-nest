<script>
  import { Label, Radio } from "flowbite-svelte";
  import "./radio-button.css";

  export let id;
  export let name;
  export let label;
  export let value;
  export let selectedValue

   function handleInput(event) {
    dispatch("radio-button-input", event.target.value);
  }
</script>

<div>
  <Radio {id} {name} {label} {value} checked={selectedValue === value} on:input={handleInput} />
  <Label for={id}>{label}</Label>
</div>
