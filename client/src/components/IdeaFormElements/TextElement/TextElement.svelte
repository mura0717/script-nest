<script>
  import { Label, Textarea } from "flowbite-svelte";
  import "./text-element.css";
  import "../../../pages/Idea/idea.css"

  export let id;
  export let label;
  export let value;
  export let rows;
  export let cols;
  export let placeholder;
  export let disabled;
</script>

<div>
  <Label class="idea-element-label"for={id}>{label}:</Label>
  <Textarea
    class="text-element-input-field"
    {id}
    bind:value
    {rows}
    {cols}
    {placeholder}
    {disabled}
  />
</div>