<script>
  import Collaborators from "./../../components/IdeaFormElements/CollaboratorElement/Collaborators.svelte";
  import { onMount } from "svelte";
  import { userStore } from "../../store/userStore.js";
  import {
    collaboratorStore,
    fetchCollaborators,
  } from "../../store/collaboratorStore.js";
  import { fetchIdea } from "../../store/ideaFetchStore.js";
  import { fetchUpdate } from "../../store/ideaFetchStore.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import MovieReferences from "../../components/IdeaFormElements/API/MovieReferences.svelte";
  import Comments from "../../components/IdeaFormElements/CommentElement/Comments.svelte";
  import debounce from "debounce";
  import { Button } from "flowbite-svelte";
  import "./idea.css";
  import "../../styles/global.css";

  let ideaId;
  let owner = {
    photoURL: $userStore.user.photoURL,
    displayName: $userStore.user.displayName,
    uid: $userStore.user.uid,
  };
  let creationTimestamp = new Date().toISOString();

  let idea = {
    owner: owner,
    creationTimestamp: creationTimestamp,
    title: "",
    logline: "",
    genre: "",
    timePeriod: "",
    setting: "",
    movieReferences: [],
    literatureReferences: [],
    premise: "",
    synopsis: "",
    comments: [],
  };

  $: ideaTitle = idea.title;

  /*   let isNewIdea = true; // Flag to check if it's a new idea
  let isInitialLoad = true;

  const debounceSave = debounce(() => handleSaveIdea(ideaId), 2000);

   $: if (!isInitialLoad && !isNewIdea) {
    debounceSave();
  } */

  onMount(async () => {
    const pathSegments = window.location.pathname.split("/");
    ideaId = pathSegments[pathSegments.length - 1];
    console.log("IdeaId from URL:", ideaId);
    if (ideaId) {
      try {
        const fetchedIdeaData = await fetchIdea(ideaId);
        idea = { ...fetchedIdeaData };
        await fetchCollaborators(ideaId);
      } catch (error) {
        console.error("Error loading idea:", error);
        throw new AppError("Error loading idea", 400);
      }
    }
  });

  $: filteredCollaborators = $collaboratorStore.filter(
    (collab) => collab.uid !== currentUserUid
  );

  let currentUserUid = $userStore.user.uid;

  function handleLitRefsUpdate(updatedLitRefs) {
    idea = { ...idea, literatureReferences: updatedLitRefs.detail };
  }

  function handleMovieRefsUpdate(updatedMovieRefs) {
    idea = { ...idea, movieReferences: updatedMovieRefs.detail };
  }

  function handleCommentsUpdate(updatedComments) {
    console.log("Idea Page - Before handleCommentsUpdate:", idea.comments);
    idea.comments = updatedComments;
    console.log("Idea Page - After handleCommentsUpdate:", idea.comments);
  }

  async function handleSaveIdea(currentIdeaId) {
    console.log("IdeaPage/ Saved IdeaId:", currentIdeaId);
    console.log("IdeaPage/ Saved Idea:", idea);
    console.log("Idea/saveIdea, collaborators:", collaborators);
    savingMessageDisplay();
    if (currentIdeaId && idea) {
      try {
        const updatedIdea = await fetchUpdate(ideaId, idea);
        if (updatedIdea) {
          idea = { ...idea, ...updatedIdea };
        } else {
          throw new AppError("Couldn't update idea", { ideaId });
        }
      } catch (error) {
        throw new AppError(`An error occured: ${error.message}`, {
          initialError: error,
        });
      }
    }
  }

  let savingText = "";
  function savingMessageDisplay() {
    savingText = "(Saving...)";
    setTimeout(() => {
      savingText = "";
    }, 2000);
  }
</script>

<main class="idea-page-container global-font">
  <!-- IDEA TITLE -->
  <div class="idea-container">
    <div class="idea-title-container">
      <div>
        <p class="idea-title">{ideaTitle || "Untitled New Idea"}</p>
        <div class="save-container">
          <Button class="save-idea-button" on:click={handleSaveIdea}
            >Save</Button
          >
          <p class="saving-text">{savingText}</p>
        </div>
      </div>
    </div>
    <!-- FORM -->
    <div class="idea-form-container">
      <form on:submit|preventDefault>
        <div class="idea-form-elements-container">
          <!-- TITLE -->
          <div class="idea-form-element">
            <TextElement
              id="title-input"
              label="Title"
              bind:value={idea.title}
              rows={1}
              cols={50}
              placeholder=""
            />
          </div>
          <!-- LOGLINE -->
          <div class="idea-form-element">
            <TextElement
              id="logline-input"
              label="Logline"
              bind:value={idea.logline}
              rows={2}
              cols={50}
              placeholder="Ex: When two young members of feuding families meet, forbidden love ensues."
            />
          </div>
          <!-- GENRE -->
          <div class="idea-form-element">
            <TextElement
              id="genre-input"
              label="Genre"
              bind:value={idea.genre}
              rows={1}
              cols={50}
              placeholder="Ex: Romance, Drama..."
            />
          </div>
          <!-- PREMISE -->
          <div class="idea-form-element">
            <TextElement
              id="premise-input"
              label="Premise"
              bind:value={idea.premise}
              rows={1}
              cols={50}
              placeholder="Ex: Love conquers all."
            />
          </div>
          <!-- TIME PERIOD -->
          <div class="idea-form-element">
            <TextElement
              id="time-input"
              label="Time Period"
              bind:value={idea.timePeriod}
              rows={1}
              cols={50}
              placeholder="Ex: Sometime in 14th Century"
            />
          </div>
          <!-- SETTING -->
          <div class="idea-form-element">
            <TextElement
              id="setting-input"
              label="Setting"
              bind:value={idea.setting}
              rows={1}
              cols={50}
              placeholder="Ex: Verona, Italy"
            />
          </div>
          <!-- SYNOPSIS -->
          <div class="idea-form-element">
            <TextElement
              id="synopsis-input"
              label="Synopsis"
              bind:value={idea.synopsis}
              rows={15}
              cols={50}
              placeholder="A detailed description of the plot goes here..."
            />
          </div>
          <!-- LITERATURE REFERENCES -->
          <div class="idea-form-element" id="lit-ref-input">
            <LiteratureReferences
              bind:literatureReferences={idea.literatureReferences}
              on:updateLitRefs={handleLitRefsUpdate}
            />
          </div>
          <!-- FILM REFERENCES -->
          <div class="idea-form-element" id="film-ref-input">
            <MovieReferences
              bind:movieReferences={idea.movieReferences}
              on:updateMovieRefs={handleMovieRefsUpdate}
            />
          </div>
          <!-- COMMENTS -->
          <div class="idea-form-element">
            <Comments on:updateComments={handleCommentsUpdate} />
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- COLLABORATORS -->
  <div class="collaborators">
    <Collaborators
      {ideaTitle}
      {ideaId}
      inviterInfo={owner}
      collaborators={filteredCollaborators}
      currentUserUid={$userStore.user.uid}
    />
  </div>
</main>
