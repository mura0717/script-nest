<script>
  import { userStore } from "./../../store/userStore.js";
  import { onMount } from "svelte";
  import "../../styles/global.css";
  import "./userprofile.css";
  import { Card, Button } from "flowbite-svelte";
  import { getRequest } from "../../store/fetchStore.js";
  import IdeasSearchBar from "../../components/IdeasSearchBar/IdeasSearchBar.svelte";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";
  import debounce from "debounce";

  let userIdeas = [];
  let filteredIdeas = [];

  console.log("Directed to User Profile page");

  onMount(async () => {
    const ideas = await fetchAllIdeas();
    userIdeas = ideas;
    filteredIdeas = ideas;
  });

  async function fetchAllIdeas() {
    try {
      const response = await getRequest(`/api/auth/ideas`);
      if (response.ok) {
        return await response.json(); // parse JSON response
      } else {
        throw new AppError("Error fetching ideas", 400);
      }
    } catch (error) {
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function getIdea(){};

  function handleSearchIdea(event) {
    const searchTitleName = event.target.value.toLowerCase();
    filteredIdeas = userIdeas.filter((idea) =>
      idea.title.toLowerCase().includes(searchTitleName)
    );
  }

  const debouncedIdeaSearch = debounce(handleSearchIdea, 500);
</script>

<main class="user-profile-main-container">
  <div class="user-profile-content w-full">
    <div class="mb-4 mt-4 ml-8 mr-8">
      <IdeasSearchBar
        on:input={(event) => debouncedIdeaSearch(event.target.value)}
        searchHandler={handleSearchIdea}
      />
    </div>

    <!--   <div class="idea-cards-container">
      <Card class="border-2">
        <h5 class="idea-card-title">Idea Title</h5>
        <p class="idea-card-content">Idea content...</p>
        <div>
          <Button class="idea-card-button">Edit</Button>
          <Button class="idea-card-button">Delete</Button>
        </div>
      </Card> -->

    {#if filteredIdeas.length == 0}
      <div>
        <p class="no-ideas-yet-text">You don't have any ideas yet.</p>
      </div>
    {:else}
      {#each filteredIdeas as idea}
        <div class="idea-card">
          <Card class="border-2">
            <h5 class="idea-card-title">{idea.title}</h5>
            <p class="idea-card-content">{idea.logline}t...</p>
            <div>
              <Button class="idea-card-button" on:click{}>Edit</Button>
              <Button class="idea-card-button">Delete</Button>
            </div>
          </Card>
        </div>
      {/each}
    {/if}
  </div>
</main>
