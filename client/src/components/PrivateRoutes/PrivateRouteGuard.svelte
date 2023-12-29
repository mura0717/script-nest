<script>
	
    import { navigate, useLocation } from "svelte-navigator";
    import { userStore } from "../../store/userStore.js";

    const location = useLocation();
  
    $: if(!$userStore.user){
        navigate("/auth/login", { //user not logged in
        state: { from: $location.pathname },
        replace: true,
      });
    } else if ($userStore.isAdmin == true) {
      navigate("/auth/admin/profile", {
        state: { from: $location.pathname },
        replace: true,
      });
    } 
  </script>
  
  {#if $userStore.user}
    <slot />
  {/if}
