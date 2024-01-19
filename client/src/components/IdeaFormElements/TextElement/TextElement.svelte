<script>
  import { Label, Textarea } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import "./text-element.css";
  import "../../../pages/Idea/idea.css";

  const dispatch = createEventDispatcher();

  export let id;
  export let label;
  export let value;
  export let rows;
  export let cols;
  export let placeholder;

  function handleInput(event) {
    dispatch("input", event.target.value);
  }
</script>

<div>
  <Label class="idea-element-label" for={id}>{label}:</Label>
  <Textarea
    class="text-element-input-field"
    {id}
    bind:value
    {rows}
    {cols}
    {placeholder}
    on:input={handleInput}
  />
</div>
