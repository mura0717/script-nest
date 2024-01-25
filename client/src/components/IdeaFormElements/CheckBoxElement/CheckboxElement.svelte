<script>
  import { Label, Checkbox } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  export let id;
  export let name;
  export let label;
  export let value;
  export let bindGroup;
  const dispatch = createEventDispatcher();

  function handleInput(event) {
    dispatch("checkbox-input", event.target.value);
  }
</script>

<div>
  <Checkbox
    {id}
    {name}
    {label}
    {value}
    bind:group={bindGroup}
    on:input={handleInput}
  />
  <Label class="checkbox-element" for={id}>{label}</Label>
</div>
