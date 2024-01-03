<script>
  import { navigate, useLocation } from "svelte-navigator";
  import { userStore } from "../../store/userStore.js";

  const location = useLocation();

  $: if ($userStore.isAuthInitialized) {
    if (!$userStore.user) {
      navigate("/auth/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    } else if ($userStore.isAdmin) {
      navigate("/auth/admin/profile", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  }
</script>

{#if $userStore.user}
  <slot />
{/if}
