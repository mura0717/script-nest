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
  } from "flowbite-svelte-icons";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore } from "../../../store/userStore.js";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import debounce from "debounce";
  import { AppError } from "../../../utils/ErrorHandling/AppError";
  import { handleError } from "../../../utils/ErrorHandling/GlobalErrorHandlerClient";

  let userName = "";
  let userSearchResults = [];
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

  async function searchUsers(userName) {
    if (userName.length > 0) {
      try {
        const results = await inviteUserByEmail(userName);
        userSearchResults = results;
        showDropdown = true;
      } catch (error) {
        handleError(error);
        throw new AppError(`An error occured: ${error.message}`, {
          initialError: error,
        });
      }
    } else {
      userSearchResults = [];
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
        userSearchResults = [];
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
</script>

<div class="collaborators-container">
  <form class="searchbar-collaborators">
    <Search size="sm" class="rounded-none py-2.5" placeholder="Add people..." />
    <Button
      class="!p-2.5 rounded-s-none"
      on:click={(event) => searchUsers(event.target.value)}
    >
      <SearchOutline class="w-5 h-5" />
    </Button>
  </form>

  {#if userSearchResults.length > 0}
    <Label class="collaborator-element-label">Collaborators:</Label>
    <Dropdown class="dropdown" size="sm" bind:open={showDropdown}>
      {#each userSearchResults as user}
        <DropdownItem class="dropdown-item">
          <img
            class="user-avatar-thumbnail"
            src={user.avatar}
            alt={user.name}
          />
          {user.name}
          <Button
            class="add-collaborator-button"
            on:click={() => addUserAsCollaborator(user)}
          >
            <UserAddOutline class="add-collaborator-icon" />
          </Button>
        </DropdownItem>
      {/each}
    </Dropdown>
  {/if}

  <Listgroup active class="collaborator-list-group">
    <ListgroupItem class="collaborator-list-element">
      <div>
        <Avatar class="avatar-collaborator-img" size="sm" />
        {userName}
      </div>
      <div>
        <Button class="remove-collaborator-button">
          <TrashBinSolid class="remove-collaborator-icon" />
        </Button>
      </div>
    </ListgroupItem>
  </Listgroup>

  {#if addedCollaborators}
    <div class="collabs-display">
      {#each addedCollaborators as collaborator, index}
        <div class="collab-item">
          <div class="collab-avatar-display">
            <img
              class="collab-avatar-image"
              src={collaborator.avatar}
              alt={collaborator.name}
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
