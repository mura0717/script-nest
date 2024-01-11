<script>
  import "./collaborators.css";
  import "../../../pages/Idea/idea.css";
  import "../../../styles/global.css";
  import {
    Modal,
    Search,
    Listgroup,
    ListgroupItem,
    Label,
    Avatar,
    Button,
    Indicator,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
  import {
    SearchOutline,
    UserAddOutline,
    TrashBinSolid,
    GlobeSolid,
    GlobeOutline,
    ExclamationCircleOutline,
  } from "flowbite-svelte-icons";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore } from "../../../store/userStore.js";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import debounce from "debounce";
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
  const collaboratorDispatch = createEventDispatcher();

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
            avatar: retrievedUser.photoURL || default_image_thumbnail,
            name: retrievedUser.displayName || "Unknown User",
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
        handleError(error);
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
        const collaboratorReference = {
          avatar: collaborator.avatar,
          name: collaborator.name,
        };

        addedCollaborators = [...addedCollaborators, collaborator];
        collaboratorDispatch("updateCollaborators", addedCollaborators);
        searchEmail = "";
        userSearchResult = "";
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function removeCollaborator(collaboratorIndex) {
    addedCollaborators = addedCollaborators.filter((_, i) => i !== collaboratorIndex);
  }

  function openRemoveCollaboratorModal(collaboratorIndex){
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

  {#if addedCollaborators.length > 0}
    <div class="collaborators-display">
      <Label class="collaborator-element-label">Collaborators:</Label>
      {#each addedCollaborators as collaborator, collaboratorIndex}
        <Listgroup active class="collaborators-list-group">
          <ListgroupItem class="collaborators-list-group-item">
            <div class="collaborators-list-group-item-display">
              <img
                class="collaborator-avatar-image"
                src={collaborator.avatar}
                alt={collaborator.name}
              />
              <p>{collaborator.name}</p>
              <button class="remove-collaborator-button" on:click={() => openRemoveCollaboratorModal(collaboratorIndex)}>
                <TrashBinSolid class="remove-collaborator-icon" />
              </button>
            </div>
          </ListgroupItem>
        </Listgroup>
      {/each}
    </div>
  {/if}
  <Modal bind:open={showShareModal} size="xs" autoclose={false}>
    <h3>Share "{ideaTitle || "Untitled New Idea" }"</h3>
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
          <ListgroupItem >
            <div class="user-search-dropdown-item">
              <img
                class="user-avatar-thumbnail"
                src={user.avatar}
                alt={user.name}
              />
              <p>{user.name}</p>
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
      <ExclamationCircleOutline
        class="modal-exclamation-icon"
      />
      <h3 class="remove-collaborator-text">
        Are you sure you want to remove collaborator?
      </h3>
      <Button color="red" class="me-2" on:click={() => removeCollaborator(currentCollaboratorIndex)} >Yes, I'm sure</Button>
      <Button color="alternative" on:click={() => (showRemoveCollaboratorModal = false)}>No, cancel</Button>
    </div>
  </Modal>
</div>
