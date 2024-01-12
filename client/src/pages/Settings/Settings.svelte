<script>
  import "../../styles/global.css";
  import "./settings.css";
  import {
    Avatar,
    Dropzone,
    Modal,
    Button,
    Label,
    Input,
  } from "flowbite-svelte";
  import {
    EditOutline,
    UploadOutline,
    PenToSquareSolid,
  } from "flowbite-svelte-icons";
  import { userStore } from "../../store/userStore";
  import { getRequest, patchRequest, postRequest } from "../../store/fetchStore.js";
  import { onMount } from "svelte";
  import { handleError } from "../../utils/ErrorHandling/GlobalErrorHandlerClient.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";

  let displayName = "";
  let email = "";
  let newDisplayName = "";
  let showImageUploadModal = false;
  let showNameEditModal = false;

  onMount(() => {
    displayName = $userStore.user.displayName;
    email = $userStore.user.email;
  });

  //EDIT NAME
  async function handleEditName(){
    console.log("Settings-handleEditName-newDisplayName:", newDisplayName)
    if(!newDisplayName) return
    try {
      const response = await patchRequest('/api/auth/user/updates', { updates: {displayName: newDisplayName}});
      newDisplayName = "";
      showNameEditModal = false;
      location.reload();
      return response;

    } catch (error) {
      handleError(error);
      throw new AppError("Name update failed:", 400);
    }
  }

  //DROPZONE
  let value = [];
  const dropHandle = (event) => {
    value = [];
    event.preventDefault();
    if (event.dataTransfer.items) {
      [...event.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          value.push(file.name);
          value = value;
        }
      });
    } else {
      [...event.dataTransfer.files].forEach((file, i) => {
        value = file.name;
      });
    }
  };

  const handleChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      value.push(files[0].name);
      value = value;
    }
  };

  const showFiles = (files) => {
    if (files.length === 1) return files[0];
    let concat = "";
    files.map((file) => {
      concat += file;
      concat += ",";
      concat += " ";
    });

    if (concat.length > 40) concat = concat.slice(0, 40);
    concat += "...";
    return concat;
  };
</script>

<main>
  <div class="page-title">
    <h1>Profile Settings</h1>
  </div>
  <div class="settings-container">
    <div>
      <div class="user-image-display">
        <Avatar class="user-image" />
        <Button
          class="edit-profile-image-button"
          on:click={() => (showImageUploadModal = true)}
        >
          <PenToSquareSolid />
        </Button>
      </div>
    </div>
    <div>
      <div class="user-info-display">
        <div class="flex">
          <p class="user-name">Name: {displayName}</p>
          <a
            href="javascript:void(0)"
            on:click={() => (showNameEditModal = true)}
            class="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-2"
            >Edit</a
          >
        </div>
        <p class="user-email">Email: {email}</p>
      </div>
    </div>
  </div>
  <Modal
    bind:open={showNameEditModal}
    size="xs"
    autoclose={false}
    class="w-full"
  >
    <form class="flex flex-col space-y-6 items-center" action="#">
      <Label class="text-xl font-medium text-gray-900 dark:text-white">
        Change Your Name
      </Label>
      <Input bind:value={newDisplayName} placeholder="New name here..."></Input>
      <Button type="submit" on:click={handleEditName}>Update Name</Button>
    </form>
  </Modal>
  <Modal
    bind:open={showImageUploadModal}
    size="xs"
    autoclose={false}
    class="w-full"
  >
    <form class="flex flex-col space-y-6 items-center" on:submit|preventDefault={handleEditName}>
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        Update Your Profile Image
      </h3>
      <Dropzone
        id="dropzone"
        class="dropzone"
        on:drop={dropHandle}
        on:dragover={(event) => {
          event.preventDefault();
        }}
        on:change={handleChange}
      >
        <svg
          aria-hidden="true"
          class="mb-3 w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          /></svg
        >
        {#if value.length === 0}
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        {:else}
          <p>{showFiles(value)}</p>
        {/if}
      </Dropzone>
    </form>
  </Modal>
</main>
