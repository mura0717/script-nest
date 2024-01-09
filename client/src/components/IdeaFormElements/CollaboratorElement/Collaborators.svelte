<script>
  import "./collaborators.css";
  import "../../../pages/Idea/idea.css";
  import "../../../styles/global.css";
  import {
    Search,
    Listgroup,
    ListgroupItem,
    Label,
    Avatar,
    Button,
    Indicator,
  } from "flowbite-svelte";
  import { TrashBinSolid, UserAddOutline } from "flowbite-svelte-icons";
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore } from "../../../store/userStore.js";

  let collaboratorName = "";
  let colloborators = [];

  function addCollaborator() {}

  function removeCollaborator() {}
</script>

<div class="collaborators-container">
  <Label class="collaborator-element-label">Collaborators:</Label>
  <Search class="searchbar-collaborators "></Search>
  <Button class="add-collaborator-button">
    <UserAddOutline class="add-collaborator-icon" />
    Add
  </Button>

  <Listgroup active class="collaborator-list-group">
    <ListgroupItem class="collaborator-list-element">
      <div>
        <Avatar class="avatar-collaborator-img" size="sm" />
        {collaboratorName}
      </div>
      <div>
        <Button class="remove-collaborator-button">
          <TrashBinSolid class="remove-collaborator-icon" />
        </Button>
      </div>
    </ListgroupItem>
  </Listgroup>
</div>
