<script>
  import Collaborators from "./Collaborators.svelte";
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
    P,
  } from "flowbite-svelte";
  import {
    SearchOutline,
    UserAddOutline,
    TrashBinSolid,
    GlobeSolid,
    ExclamationCircleOutline,
  } from "flowbite-svelte-icons";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { createEventDispatcher, onMount } from "svelte";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import { AppError } from "../../../utils/ErrorHandling/AppError";
  import { handleError } from "../../../utils/ErrorHandling/GlobalErrorHandlerClient";

  let searchEmail = "";
  let userSearchResult = "";
  let addedCollaborators = [];
  let showDropdown = false;
  let showShareModal = false;
  let currentCollaboratorIndex;
  let showRemoveCollaboratorModal = false;
  export let ideaTitle;
  export let collaborators = [];
  export let ideaId;
  export let inviterName;

  const collaboratorDispatch = createEventDispatcher();

  $: if (Array.isArray(collaborators)) {
    addedCollaborators = [...collaborators];
  }

  async function inviteUserByEmail(userEmail) {
    try {
      const response = await getRequest(
        `/api/auth/user/inviteUserByEmail?email=${encodeURIComponent(
          userEmail
        )}`
      );
      console.log("CollaboratorsElement - Invite by Email response:", response);
      console.log(
        "CollaboratorElement- Invite Users by Email Response Data:",
        response.data
      );
      if (response && response.data) {
        const retrievedUser = response.data;
        userEmail = "";
        return [
          {
            photoURL: retrievedUser.photoURL || default_image_thumbnail,
            displayName: retrievedUser.displayName || "Unknown User",
            uid: retrievedUser.uid || "Unknown UID",
          },
        ];
      } else {
        throw new AppError("Invitation not sent to:", { userEmail });
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function searchUsers() {
    if (searchEmail != "") {
      try {
        const result = await inviteUserByEmail(searchEmail);
        console.log("Collaborators Element - searchusers:", result);
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

  async function addUserAsCollaborator(collaborator) {
    console.log("Collaborator Element - Add Collaborator:", collaborator);
    try {
      if (collaborator) {
        const collabData = {
          photoURL: collaborator.photoURL,
          displayName: collaborator.displayName,
          uid: collaborator.uid,
          ideaTitle: ideaTitle,
          inviterName: inviterName,
        };
        const response = postRequest(
          `/api/auth/ideas/${ideaId}/collaborators`,
          collabData
        );
        
        if (response) {
          console.log("adduser as collabresponse:", response)
          addedCollaborators = [...addedCollaborators, collaborator];
          collaboratorDispatch("updateCollaborators", addedCollaborators);
          searchEmail = "";
          userSearchResult = "";
        } else {
          throw new AppError(`An error occured: ${error.message}`, {
            initialError: error,
          });
        }
      }
    } catch (error) {
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function removeCollaborator(collaboratorIndex) {
    addedCollaborators = addedCollaborators.filter(
      (_, i) => i !== collaboratorIndex
    );
  }

  function openRemoveCollaboratorModal(collaboratorIndex) {
    currentCollaboratorIndex = collaboratorIndex;
    showRemoveCollaboratorModal = true;
  }

  function openShareModal() {
    showShareModal = true;
  }
</script>

<div class="collaborators-container">
  <Button class="share-modal-button" on:click={openShareModal}>
    <GlobeSolid />
    <p>Share</p>
  </Button>
  <div>
    {#if addedCollaborators.length > 0}
      <div class="collaborators-display">
        <Label class="collaborator-element-label">Collaborators:</Label>
        {#each addedCollaborators as collaborator, collaboratorIndex}
          <Listgroup active class="collaborators-list-group">
            <ListgroupItem class="collaborators-list-group-item">
              <div class="collaborators-list-group-item-display">
                <img
                  class="collaborator-avatar-image"
                  src={collaborator.photoURL}
                  alt={collaborator.displayName}
                />
                <p>{collaborator.displayName}</p>
                <button
                  class="remove-collaborator-button"
                  on:click={() =>
                    openRemoveCollaboratorModal(collaboratorIndex)}
                >
                  <TrashBinSolid class="remove-collaborator-icon" />
                </button>
              </div>
            </ListgroupItem>
          </Listgroup>
        {/each}
      </div>
    {:else}
      <p class="mt-3 ml-5 text-center">No collaborators yet.</p>
    {/if}
  </div>
  <Modal bind:open={showShareModal} size="xs" autoclose={false}>
    <h3>Share "{ideaTitle || "Untitled New Idea"}"</h3>
    <form class="searchbar-collaborators-container">
      <Search
        size="sm"
        class="searchbar-display"
        placeholder="Add people..."
        bind:value={searchEmail}
      />
      <Button class="search-button-display" on:click={searchUsers}>
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
          <ListgroupItem>
            <div class="user-search-dropdown-item">
              <img
                class="user-avatar-thumbnail"
                src={user.photoURL}
                alt={user.displayName}
              />
              <p>{user.displayName}</p>
              <Button
                class="add-collaborator-button"
                on:click={() => addUserAsCollaborator(user)}
              >
                <UserAddOutline class="add-collaborator-icon" />
              </Button>
            </div>
          </ListgroupItem>
        {/each}
      </Listgroup>
    {/if}
  </Modal>
  <Modal bind:open={showRemoveCollaboratorModal} size="xs" autoclose>
    <div class="remove-collaborator-modal-container">
      <ExclamationCircleOutline class="modal-exclamation-icon" />
      <h3 class="modal-text">Are you sure you want to remove collaborator?</h3>
      <Button
        color="red"
        class="me-2"
        on:click={() => removeCollaborator(currentCollaboratorIndex)}
        >Yes, I'm sure</Button
      >
      <Button
        color="alternative"
        on:click={() => (showRemoveCollaboratorModal = false)}
        >No, cancel</Button
      >
    </div>
  </Modal>
</div>
