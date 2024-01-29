<script>
  import { Label, Radio } from "flowbite-svelte";
  import "./radio-button.css";
  import { createEventDispatcher } from "svelte";

  export let id;
  export let name;
  export let label;
  export let value;
  export let selectedValue;
  const dispatch = createEventDispatcher();

  function handleInput(event) {
    dispatch("radio-button-change", event.target.value);
    console.log("event-target-value:", event.target.value);
  }

  console.log("dispatch:", dispatch);
</script>

<div>
  <Radio
    {id}
    {name}
    {label}
    {value}
    checked={selectedValue === value}
    on:change={handleInput}
  />
  <Label for={id}>{label}</Label>
</div>
