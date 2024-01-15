<script>
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
  import { userStore } from "../../store/userStore";

  export let path;
</script>

<Route {path} let:params let:location let:navigate>
  <PrivateRouteGuard>
    {#if $userStore.user}
      <slot {params} {location} {navigate} />
    {/if}
  </PrivateRouteGuard>
</Route>
