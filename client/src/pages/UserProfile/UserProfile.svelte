<script>
  import "../../styles/global.css";
  import "./userprofile.css";
  import { Card, Button } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { userStore } from "./../../store/userStore.js";
  import { getRequest } from "../../store/fetchStore.js";
  import IdeasSearchBar from "../../components/IdeasSearchBar/IdeasSearchBar.svelte";
  import Sidebar from "../../components/SideBar/SideBar.svelte";

  let userIdeas = [];

  console.log("User Profile");

  onMount(async () => {
    const { user } = $userStore.user;
    if (user) {
      const response = await getRequest("/api/ideas");
      if (response.ok) {
        userIdeas = await response.json();
      }
    }
  });

  function handleSearchInput(event) {
    const searchTerm = event.target.value;
    // Implement search logic here
  }
</script>

<main class="user-profile-main-container">
  <aside class="sidebar-container">
    <Sidebar />
  </aside>
  <div class="user-profile-content">
    <div class="mb-4">
      <IdeasSearchBar searchHandler={handleSearchInput} />
    </div>

    <Card class="border-2">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Idea Title
      </h5>
      <p
        class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
      >
        Idea title content...
      </p>
      <div>
        <Button class="w-fit mb-3">Edit</Button>
        <Button class="w-fit">Delete</Button>
      </div>
    </Card>
    <div class="idea-cards-container">
      <!-- Iterate over your userIdeas here to display cards -->
      {#each userIdeas as idea}
        <div class="idea-card">
          <!-- Content of the card -->
        </div>
      {/each}
    </div>
  </div>
</main>
