<script>
  import "../../components/SideBar/sidebar.css";
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
    UsersSolid,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { userStore } from "../../store/userStore.js";
  import { ideaStore } from "../../store/ideaStore.js";
  import { navigate } from "svelte-navigator";
  import { signOutUser } from "../../config/firebaseClientConfig";
  import { handleError } from "../../utils/ErrorHandling/GlobalErrorHandlerClient.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";
  import { postRequest } from "../../store/fetchStore";

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

  async function handleNewIdea() {
    console.log("Sidebar/Create New Idea is clicked.");
    ideaStore.resetIdea();
    try {
      const newIdeaResponse = await postRequest("/api/auth/ideas");
      console.log("Sidebar/handleNewIdea/newIdeaResponse:", newIdeaResponse);
      console.log("Sidebar/handleNewIdea/newIdeaResponse.id:", newIdeaResponse.id);
      if (newIdeaResponse && newIdeaResponse.id) {
        ideaStore.setIdea({ ...defaultIdeaState, id: newIdeaResponse.id });
        navigateToRoute("/auth/user/ideas/${newIdeaResponse.id}");
      } else {
        throw new AppError("Error creating new idea", 400);
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  onMount(() => {
    userName = $userStore.user.displayName;
    console.log(userName);
  });
</script>

<div class="sidebar-container">
  <Sidebar>
    <SidebarWrapper>
      <SidebarGroup class="sidebar-group">
        <div class="sidebar-user-display">
          <Avatar class="sidebar-avatar-image" />
          <p class="sidebar-username-display">{userName}</p>
        </div>
        <SidebarItem label="New Idea" on:click={() => handleNewIdea()}>
          <svelte:fragment slot="icon">
            <FileOutline class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem
          label="My Ideas"
          on:click={() => navigateToRoute("/auth/user/profile")}
        >
          <svelte:fragment slot="icon">
            <FolderOpenOutline class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem
          label="Shared with me"
          on:click={() => navigateToRoute("/auth/user/sharedwithme")}
        >
          <svelte:fragment slot="icon">
            <UsersSolid class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem
          label="Settings"
          on:click={() => navigateToRoute("/auth/user/settings")}
        >
          <svelte:fragment slot="icon">
            <UserSettingsOutline class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem
          label="Trash"
          on:click={() => navigateToRoute("/auth/user/trash")}
        >
          <svelte:fragment slot="icon">
            <TrashBinOutline class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Sign Out" on:click={handleLogout}>
          <svelte:fragment slot="icon">
            <ArrowRightToBracketSolid class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
</div>
