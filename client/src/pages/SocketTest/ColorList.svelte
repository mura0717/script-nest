<script>
    import { colorList } from "./colorStore.js";
</script>

{#each $colorList as colorListItem}
    <h4 style="background-color: {colorListItem.color};">{colorListItem.name}</h4>
{/each}