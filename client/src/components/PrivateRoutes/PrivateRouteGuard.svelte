<script>
    import { navigate, useLocation } from "svelte-navigator";
    import { user } from "../../store/usersStore.js";

    const location = useLocation();
  
    $: if(!$user){
        navigate("/auth/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    } else if ($user.isAdmin == 0) {
      navigate("/auth/user/profile", {
        state: { from: $location.pathname },
        replace: true,
      });
    } 
  </script>
  
  {#if $user}
    <slot />
  {/if}
