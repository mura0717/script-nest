<script>
  import { Input } from "flowbite-svelte";
  import { SearchOutline } from "flowbite-svelte-icons";

  export let searchHandler;
</script>


  <div class="relative md:block">
    <div
      class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none"
    >
      <SearchOutline class="w-4 h-4" />
    </div>
    <Input
      id="search-navbar"
      class="ps-10"
      placeholder="Search..."
      on:input={searchHandler}
    />
  </div>
