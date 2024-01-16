<script>
  import Collaborators from "./../../components/IdeaFormElements/CollaboratorElement/Collaborators.svelte";
  import { onMount } from "svelte";
  import { userStore } from "../../store/userStore";
  import { fetchIdea } from "../../store/ideaFetchStore.js";
  import { fetchUpdate } from "../../store/ideaFetchStore.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";
  import { handleError } from "../../utils/ErrorHandling/GlobalErrorHandlerClient.js";
  import * as fetchStore from "../../store/fetchStore";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBox/CheckboxElement.svelte";
  import RadioButtonElement from "../../components/IdeaFormElements/RadioButton/RadioButtonElement.svelte";
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import MovieReferences from "../../components/IdeaFormElements/API/MovieReferences.svelte";
  import Comments from "../../components/IdeaFormElements/CommentElement/Comments.svelte";
  import debounce from "debounce";
  import { Button } from "flowbite-svelte";
  import "./idea.css";
  import "../../styles/global.css";
  import { Label } from "flowbite-svelte";

  let ideaId;
  let owner = {
    photoURL: $userStore.user.photoURL,
    displayName: $userStore.user.displayName,
    uid: $userStore.user.uid,
  };

  let idea = {
    owner: owner,
    title: "",
    logline: "",
    selectedOrigin: "",
    sourceMaterial: "",
    authors: "",
    selectedGenres: [],
    timePeriod: "",
    setting: "",
    movieReferences: [],
    literatureReferences: [],
    premise: "",
    synopsis: "",
    comments: [],
    collaborators: [],
  };

  $: ideaTitle = idea.title;

  onMount(async () => {
    const pathSegments = window.location.pathname.split("/");
    ideaId = pathSegments[pathSegments.length - 1];
    console.log("Idea ID from URL:", ideaId);
    if (ideaId) {
      idea = await fetchIdea(ideaId);
      console.log("Idea/onMount, fetchedIdea:", idea);
    } else {
      console.log("Idea/onMount, error");
      throw new AppError(`Error reading the idea with id:${ideaId}`, 400);
    }
  });

  $: collaborators = idea.collaborators;

  function handleCollaboratorsUpdate(updateCollaborators) {
    idea = { ...idea, collaborators: updateCollaborators.detail };
  }

  $: literatureReferences = idea.literatureReferences;
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
  <div>
    <Collaborators
      {ideaTitle}
      {collaborators}
      on:updateCollaborators={handleCollaboratorsUpdate}
    />
  </div>
</main>
