<script>
  import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
    Avatar,
  } from "flowbite-svelte";
  import {
    FolderOpenOutline,
    FileOutline,
    ArrowRightToBracketSolid,
    UserSettingsOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { userStore } from "../../store/userStore.js";
  import { navigate } from "svelte-navigator";
  import { signOutUser } from "../../config/firebaseClientConfig";
  import { handleError } from "../../utils/ErrorHandling/GlobalErrorHandlerClient.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";

  async function navigateToRoute(route) {
    if (!$userStore.user) {
      const error = new AppError("Unauthorized access.", {
        status: "Unauthorized",
      });
      handleError(error);
      return;
    }
    // Additional check if route requires admin access 
    /* if (routeRequiresAdmin(route) && !$userStore.isAdmin) {
        const error = new AppError("Unauthorized access. Admin only.", { status: "Unauthorized" });
        handleError(error);
        return;
    } */
    navigate(route);
  }

/*   function routeRequiresAdmin(route) {
    // Define logic to determine if a route requires admin access
    // For example:
    return route.startsWith('/auth/admin');
} */

  async function handleLogout() {
    signOutUser()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }

  export let userName = "";

  onMount(() => {
    userName = $userStore.user.email;
    console.log(userName);
  });
</script>

<Sidebar>
  <SidebarWrapper>
    <SidebarGroup>
      <SidebarItem label="My Ideas" on:click={() => navigateToRoute('/auth/user/profile')}>
        <svelte:fragment slot="icon">
          <FolderOpenOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="New Idea" on:click={() => navigateToRoute('/auth/user/newidea')}>
        <svelte:fragment slot="icon">
          <FileOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Settings" on:click={() => navigateToRoute('/auth/user/settings')}>
        <svelte:fragment slot="icon">
          <UserSettingsOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Trash" on:click={() => navigateToRoute('/auth/user/trash')}>
        <svelte:fragment slot="icon">
          <TrashBinOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
    </SidebarGroup>
    <SidebarGroup>
      <SidebarItem label="Sign Out" on:click={handleLogout}>
        <svelte:fragment slot="icon">
          <ArrowRightToBracketSolid class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
    </SidebarGroup>
    <div class="text-xs">
      {userName}
    </div>
  </SidebarWrapper>
</Sidebar>
