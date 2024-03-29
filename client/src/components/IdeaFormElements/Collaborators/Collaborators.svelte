<script>
  import "./collaborators.css";
  import "../../../styles/global.css";
  import "../../../pages/Idea/idea.css";
  import "../../../styles/global.css";
  import {
    Modal,
    Search,
    Listgroup,
    ListgroupItem,
    Label,
    Button,
  } from "flowbite-svelte";
  import {
    SearchOutline,
    UserAddOutline,
    TrashBinSolid,
    GlobeSolid,
    ExclamationCircleOutline,
  } from "flowbite-svelte-icons";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import { removeCollaborator } from "../../../store/collaboratorStore.js";
  import { AppError } from "../../../utils/ErrorHandling/AppError";
  import { toast } from "svelte-french-toast";
  import { userStore } from "../../../store/userStore";

  let searchEmail = "";
  let userSearchResult = "";
  let showDropdown = false;
  let showShareModal = false;
  let showRemoveInviteModal = false;
  let invitationMessage = "";
  let currentCollaboratorId;
  let currentCollaboratorName;
  let currentUserUid = $userStore.user.uid;
  export let ideaTitle;
  export let ideaId;
  export let inviterInfo;
  export let collaborators = [];
  export let ideaOwner = "";

  async function getUserByEmail(userEmail) {
    try {
      const response = await getRequest(
        `/api/auth/user/getUserByEmail?email=${encodeURIComponent(userEmail)}`
      );
      if (response && response.data) {
        const retrievedUser = response.data;
        userEmail = "";
        console.log("retrievedUser", retrievedUser);
        return [
          {
            photoURL: retrievedUser.photoURL || default_image_thumbnail,
            displayName: retrievedUser.displayName || "Unknown User",
            uid: retrievedUser.uid || "Unknown UID",
          },
          console.log("retrievedUser", retrievedUser.displayName),
        ];
      } else {
        throw new AppError("Failed to send invitation to:", { userEmail });
      }
    } catch (error) {
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function searchUsers() {
    if (searchEmail != "") {
      try {
        const result = await getUserByEmail(searchEmail);
        userSearchResult = result;
        showDropdown = true;
      } catch (error) {
        throw new AppError(`An error occured: ${error.message}`, {
          initialError: error,
        });
      }
    } else {
      userSearchResult = "";
    }
  }

  function isCollaboratorSelected(collabortorToCheck) {
    return collaborators.some(
      (collaborator) => collaborator.uid === collabortorToCheck.uid
    );
  }

  async function inviteUserAsCollaborator(collaborator) {
    try {
      if (collaborator && !isCollaboratorSelected(collaborator)) {
        const collabData = {
          displayName: collaborator.displayName,
          photoURL: collaborator.photoURL,
          uid: collaborator.uid,
          ideaTitle: ideaTitle,
          ideaId: ideaId,
          inviterInfo: inviterInfo,
        };
        console - log("2invite users stotr:", collabData);
        const response = await postRequest(
          `/api/auth/ideas/${ideaId}/invite-collaborator`,
          collabData
        );
        if (response) {
          invitationMessage = `Invitation sent to ${collaborator.displayName}`;
          searchEmail = "";
          userSearchResult = "";
          setTimeout(() => {
            invitationMessage = "";
          }, 3000);
        }
      }
    } catch (error) {
      invitationMessage =
        "Failed to send invitation to " + collaborator.displayName;
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function canRemove() {
    return inviterInfo.uid === currentUserUid;
  }
  console.log(canRemove());

  function openShareModal() {
    showShareModal = true;
  }

  function openRemoveCollaboratorModal(collaboratorId, collaboratorName) {
    currentCollaboratorId = collaboratorId;
    currentCollaboratorName = collaboratorName;
    showRemoveInviteModal = true;
  }

  function confirmRemoveCollaborator() {
    removeCollaborator(ideaId, currentCollaboratorId);
    toast.success(`"${currentCollaboratorName}" removed successfully.`);
    showRemoveInviteModal = false;
  }
</script>

<div class="collaborators-container mr-16">
  <Button class="share-modal-button " on:click={openShareModal}>
    <GlobeSolid />
    <p>Share</p>
  </Button>
  <div>
    <!-- DISPLAY OWNER & COLLABORATORS -->
    <div class="owner-display">
      <p>Idea Author: {inviterInfo.displayName}</p>
    </div>
    {#if collaborators.length > 0}
      <div class="collaborators-display">
        <Label class="collaborator-element-label">Collaborators:</Label>
        {#each collaborators as collaborator}
          <Listgroup active class="collaborators-list-group">
            <ListgroupItem class="collaborators-list-group-item  border-1">
              <div class="collaborators-list-group-item-display">
                <img
                  class="collaborator-avatar-image"
                  src={collaborator.photoURL}
                  alt={collaborator.displayName}
                />
                <p>{collaborator.displayName}</p>
                <button
                  class="remove-collaborator-button"
                  disabled={!canRemove(collaborator)}
                  on:click={() =>
                    openRemoveCollaboratorModal(
                      collaborator.id,
                      collaborator.displayName
                    )}
                >
                  <TrashBinSolid class="remove-collaborator-icon" />
                </button>
              </div>
            </ListgroupItem>
          </Listgroup>
        {/each}
      </div>
    {:else}
      <p class="no-collab-text">No collaborators yet.</p>
    {/if}
  </div>
  <!-- SEARCH AND ADD MODAL -->
  <Modal bind:open={showShareModal} size="xs" autoclose={false}>
    <h3>Share "{ideaTitle || "Untitled New Idea"}"</h3>
    <form class="searchbar-collaborators-container">
      <Search
        size="md"
        class="searchbar-display rounded-r-none"
        placeholder="Add people..."
        bind:value={searchEmail}
      />
      <Button
        class="search-button-display rounded-s-none"
        on:click={searchUsers}
      >
        <SearchOutline class="search-outline-icon" />
      </Button>
    </form>
    {#if userSearchResult}
      <Listgroup
        class="user-search-dropdown"
        size="sm"
        bind:open={showDropdown}
      >
        {#each userSearchResult as user}
          <ListgroupItem size="sm">
            <div class="user-search-dropdown-item">
              <img
                class="user-avatar-thumbnail"
                src={user.photoURL}
                alt={user.displayName}
              />
              <p>{user.displayName}</p>
              <Button
                size="sm"
                class="add-collaborator-button"
                disabled={isCollaboratorSelected(user)}
                on:click={() => inviteUserAsCollaborator(user)}
              >
                <UserAddOutline class="add-collaborator-icon" />
              </Button>
            </div>
          </ListgroupItem>
        {/each}
      </Listgroup>
    {/if}
    {#if invitationMessage}
      <p>{invitationMessage}</p>
    {/if}
  </Modal>
  <!-- REMOVE COLLABORATOR -->
  <Modal bind:open={showRemoveInviteModal} size="xs" autoclose>
    <div class="remove-collaborator-modal-container">
      <ExclamationCircleOutline size="xl" class="modal-exclamation-icon" />
      <h3 class="modal-text">Are you sure you want to remove collaborator?</h3>
      <Button color="red" class="me-2" on:click={confirmRemoveCollaborator}
        >Yes, I'm sure</Button
      >
      <Button
        color="alternative"
        on:click={() => (showRemoveInviteModal = false)}>No, cancel</Button
      >
    </div>
  </Modal>
</div>
