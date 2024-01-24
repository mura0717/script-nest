<script>
  import Comments from "./../../components/IdeaFormElements/CommentElement/Comments.svelte";
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
  import debounce from "debounce";

  import "./idea.css";
  import "../../styles/global.css";

  let ideaId;
  let isInitialLoad = true;
  let userMadeChanges = false;

  export let ideaOwner;
  $: if (idea && idea.owner) {
    ideaOwner = idea.owner;
  }

  let owner = {
    photoURL: $userStore.user.photoURL,
    displayName: $userStore.user.displayName,
    uid: $userStore.user.uid,
  };

  let idea = {
    owner: owner,
    creationTimestamp: null,
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

  onMount(async () => {
    const pathSegments = window.location.pathname.split("/");
    ideaId = pathSegments[pathSegments.length - 1];
    if (ideaId) {
      try {
        const fetchedIdeaData = await fetchIdea(ideaId);
        if (fetchedIdeaData) {
          idea = { ...fetchedIdeaData };
          ideaOwner = fetchIdea.owner;
          userMadeChanges = false;
          await fetchCollaborators(ideaId);
        } else {
          idea.creationTimestamp = new Date().toISOString();
          handleSaveIdea(ideaId);
        }
      } catch (error) {
        console.error("Error loading idea:", error);
        throw new AppError("Error loading idea", 400);
      }
    } else {
      idea.creationTimestamp = new Date().toISOString();
      handleSaveIdea(null);
    }
    isInitialLoad = false;
  });

  $: allCollaborators = $collaboratorStore;

  function handleInputChange(field, value) {
    userMadeChanges = true;
    idea[field] = value;
  }

   function handleLitRefsUpdate(updatedLitRefs) {
    userMadeChanges = true;
    idea = { ...idea, literatureReferences: updatedLitRefs.detail };
  }

  function handleMovieRefsUpdate(updatedMovieRefs) {
    userMadeChanges = true;
    idea = { ...idea, movieReferences: updatedMovieRefs.detail };
  }

  function handleCommentsUpdate(updatedComments) {
    userMadeChanges = true;
    idea = { ...idea, comments: updatedComments.detail };
  }

  async function handleSaveIdea(currentIdeaId) {
    savingMessageDisplay();
    if (currentIdeaId && idea) {
      try {
        const updatedIdea = await fetchUpdate(ideaId, idea);
        if (updatedIdea) {
          console.log("ideaPrevious:", idea)
          idea = { ...idea, ...updatedIdea };
          console.log("updated idea:", updatedIdea)
            console.log("ideaUpdated:", idea)
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
  $: if (!isInitialLoad && userMadeChanges) {
    debounceSave();
  }
  const debounceSave = debounce(() => {
    if (userMadeChanges) {
      handleSaveIdea(ideaId);
      userMadeChanges = false;
    }
  }, 500);

  let savingText = "";
  function savingMessageDisplay() {
    savingText = "(Auto-Saving...)";
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
        <div class="flex">
          <p class="idea-title">{ideaTitle || "Untitled New Idea"}</p>
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
              on:input={() => handleInputChange("title", idea.title)}
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
              on:input={() => handleInputChange("logline", idea.logline)}
              rows={2}
              cols={100}
              placeholder="Ex: When two young members of feuding families meet, forbidden love ensues."
            />
          </div>
          <!-- GENRE -->
          <div class="idea-form-element">
            <TextElement
              id="genre-input"
              label="Genre"
              bind:value={idea.genre}
              on:input={() => handleInputChange("genre", idea.genre)}
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
              on:input={() => handleInputChange("premise", idea.premise)}
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
              on:input={() => handleInputChange("timePeriod", idea.timePeriod)}
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
              on:input={() => handleInputChange("setting", idea.setting)}
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
              on:input={() => handleInputChange("synopsis", idea.synopsis)}
              rows={15}
              cols={50}
              placeholder="A detailed description of the plot goes here..."
            />
          </div>
          <!-- BOOK REFERENCES -->
          <div class="idea-form-element" id="book-ref-input">
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
            <Comments
              bind:comments={idea.comments}
              on:updateComments={handleCommentsUpdate}
            />
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
      collaborators={allCollaborators}
    />
  </div>
</main>
