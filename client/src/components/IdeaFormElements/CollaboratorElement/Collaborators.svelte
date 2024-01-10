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
    TrashBinSolid, GlobeSolid, GlobeOutline,
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
        return [
          {
            avatar: retrievedUser.photoURL || default_image_thumbnail,
            name: retrievedUser.displayName || "Unknown User",
          },
        ];
      } else {
        throw new AppError("No users found with this email:", { userEmail });
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
        userSearchResult = "";
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function removeCollaborator() {
    addedCollaborators = addedCollaborators.filter((_, i) => i !== index);
  }

  function showShareModal(){}
</script>



<div class="collaborators-container">
    <Button on:click={showShareModal}>
        <GlobeSolid/>
        Share
    </Button>
  <Label class="collaborator-element-label">Collaborators:</Label>
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
    <Dropdown class="user-search-dropdown" size="sm" bind:open={showDropdown}>
      {#each userSearchResult as user}
        <DropdownItem class="user-search-dropdown-item">
          <div class="user-search-dropdown-item-display">
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
        </DropdownItem>
      {/each}
    </Dropdown>
  {/if}

  {#if addedCollaborators}
    <div class="collaborators-display">
      {#each addedCollaborators as collaborator, index}
        <Listgroup active class="collaborators-list-group">
          <ListgroupItem class="collaborators-list-group-item">
            <div class="collaborators-list-group-item-display">
              <img
                class="collaborator-avatar-image"
                src={collaborator.avatar}
                alt={collaborator.name}
              />
              <p>{collaborator.name}</p>
              <Button class="remove-collaborator-button">
                <TrashBinSolid class="remove-collaborator-icon" />
              </Button>
            </div>
          </ListgroupItem>
        </Listgroup>
      {/each}
    </div>
  {/if}
</div>
