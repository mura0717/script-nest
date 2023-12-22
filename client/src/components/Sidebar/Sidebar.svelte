<script>
  import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from "flowbite-svelte";
  import {
    FolderOpenOutline,
    UserSolid,
    FileOutline,
    ArrowRightToBracketSolid,
    UserSettingsOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { userStore } from "./../../store/userStore.js";

  export let userName = '';

  onMount(() => {
    userName = $userStore.user;
  });

</script>

<Sidebar>
  <SidebarWrapper>
    <SidebarGroup>
      <SidebarItem label="My Ideas">
        <svelte:fragment slot="icon">
          <FolderOpenOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="New Idea" href="/auth/ideaform">
        <svelte:fragment slot="icon">
          <FileOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Settings" href="/auth/settings">
        <svelte:fragment slot="icon">
          <UserSettingsOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Trash" href="/auth/trash">
        <svelte:fragment slot="icon">
          <TrashBinOutline class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
    </SidebarGroup>
    <SidebarGroup>
      <SidebarItem label="Sign Out" href="/">
        <svelte:fragment slot="icon">
          <ArrowRightToBracketSolid class="w-5 h-5" />
        </svelte:fragment>
      </SidebarItem>
      {userName}
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
