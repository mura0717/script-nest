<script>
  import { onMount } from "svelte";
  import "../../styles/global.css";
  import "./userprofile.css";
  import { Card, Button, Modal } from "flowbite-svelte";
  import { navigate } from "svelte-navigator";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  import { fetchAllIdeas, deleteIdea } from "../../store/ideaFetchStore.js";
  import IdeasSearchBar from "../../components/IdeasSearchBar/IdeasSearchBar.svelte";
  import debounce from "debounce";

  let userIdeas = [];
  let filteredIdeas = [];
  let showDeleteIdeaModal = false;
  let currentIdeaId;

  onMount(async () => {
    const ideas = await fetchAllIdeas();
    userIdeas = ideas;
    filteredIdeas = ideas;
  });

  function handleEditIdea(ideaId) {
    navigate(`/auth/user/ideas/${ideaId}`, { replace: true });
  }

  function openDeleteIdeaModal(ideaId) {
    currentIdeaId = ideaId;
    showDeleteIdeaModal = true;
  }

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
    {#if filteredIdeas.length === 0}
      <div>
        <p class="no-ideas-yet-text">You don't have any ideas yet.</p>
      </div>
    {:else}
      {#each filteredIdeas as idea}
        <div class="idea-cards-container">
          <Card size="xs" class="idea-card">
            <h5 class="idea-card-title">{idea.title}</h5>
            <p class="idea-card-content">{idea.logline}</p>
            <div>
              <Button
                class="idea-card-button"
                on:click={() => handleEditIdea(idea.id)}>Edit</Button
              >
              <Button
                class="idea-card-button"
                on:click={() => openDeleteIdeaModal(idea.id)}>Delete</Button
              >
            </div>
          </Card>
        </div>
      {/each}
    {/if}
  </div>
  <Modal bind:open={showDeleteIdeaModal} size="xs" autoclose>
    <div class="remove-ref-modal-container">
      <ExclamationCircleOutline class="modal-exclamation-icon" />
      <h3 class="modal-text">Are you sure you want to delete this idea?</h3>
      <Button
        color="red"
        class="me-2"
        on:click={() => deleteIdea(currentIdeaId)}>Yes, I'm sure</Button
      >
      <Button color="alternative" on:click={() => (showDeleteIdeaModal = false)}
        >No, cancel</Button
      >
    </div>
  </Modal>
</main>
