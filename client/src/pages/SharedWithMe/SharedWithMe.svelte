<script>
  import "../../styles/global.css";
  import "./shared-with-me.css";
  import "../UserProfile/userprofile.css";
  import { Card, Button } from "flowbite-svelte";
  import { getRequest } from "../../store/fetchStore.js";
  import IdeasSearchBar from "../../components/IdeasSearchBar/IdeasSearchBar.svelte";

  let sharedIdeas = [];

  console.log("Directed to Shared page");

  function handleSearchInput(event) {
    const searchTerm = event.target.value;
    // Implement search logic here
  }
</script>

<main class="user-profile-main-container">
  <div class="user-profile-content w-full">
    <div class="mb-4 mt-4 ml-8 mr-8">
      <IdeasSearchBar searchHandler={handleSearchInput} />
    </div>

    <div class="idea-cards-container">
      <Card class="border-2">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Shared Idea Title
        </h5>
        <p
          class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
        >
          Shared Idea content...
        </p>
        <div>
          <Button class="p-2 w-fit mb-0">View</Button>
          <Button class="p-2 w-fit mb-0">Remove</Button>
        </div>
      </Card>
      <!-- Iterate over your userIdeas here to display cards -->
      {#each sharedIdeas as idea}
        <div class="idea-card">
          <!-- Content of the card -->
        </div>
      {/each}
    </div>
  </div>
</main>
