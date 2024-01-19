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
    UsersSolid,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { userStore } from "../../store/userStore.js";
  import { navigate } from "svelte-navigator";
  import { signOutUser } from "../../config/firebaseClientConfig";
  import { handleError } from "../../utils/ErrorHandling/GlobalErrorHandlerClient.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";
  import { postRequest } from "../../store/fetchStore";

  let userName = "";
  onMount(() => {
    userName = $userStore.user.displayName;
  });

  async function navigateToRoute(route) {
    if (!$userStore.user) {
      const error = new AppError("Unauthorized access.", {
        status: "Unauthorized",
      });
      handleError(error);
      return;
    }
    navigate(route, { replace: true });
  }

  async function handleNewIdea() {
    console.log("Sidebar/Create New Idea is clicked.");
    try {
      const newIdeaResponse = await postRequest("/api/auth/ideas");
      if (newIdeaResponse && newIdeaResponse.id) {
        navigateToRoute(`/auth/user/ideas/${newIdeaResponse.id}`);
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

  async function handleLogout() {
    signOutUser()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        handleError(error);
        console.error("Sign out error:", error);
      });
  }
</script>

<div class="sidebar-container">
  <Sidebar>
    <SidebarWrapper>
      <SidebarGroup class="sidebar-group">
        <div class="sidebar-user-display">
          <Avatar class="sidebar-avatar-image" />
          <p class="sidebar-username-display">{userName}</p>
        </div>
        <div class="sidebar-new-idea-button">
          <FileOutline class="sidebar-item-icon" />
          <button label="New Idea" on:click={() => handleNewIdea()}
            >New Idea
          </button>
        </div>
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
        <SidebarItem label="Sign Out" on:click={handleLogout}>
          <svelte:fragment slot="icon">
            <ArrowRightToBracketSolid class="sidebar-item-icon" />
          </svelte:fragment>
        </SidebarItem>
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
</div>
