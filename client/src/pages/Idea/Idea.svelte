<script>
  import Comments from "../../components/IdeaFormElements/Comments/Comments.svelte";
  import Collaborators from "../../components/IdeaFormElements/Collaborators/Collaborators.svelte";
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
  import RadioButtonElement from "../../components/IdeaFormElements/RadioButtonElement/RadioButtonElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBoxElement/CheckboxElement.svelte";
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import MovieReferences from "../../components/IdeaFormElements/API/MovieReferences.svelte";
  import debounce from "debounce";
  import { Label } from "flowbite-svelte";
  import "./idea.css";
  import "../../styles/global.css";

  let ideaId;
  let isInitialLoad = true;
  let userMadeChanges = false;

  export let ideaAuthor;
  $: if (idea && idea.author) {
    ideaAuthor = idea.author;
  }

  let currentUser = {
    photoURL: $userStore.user.photoURL,
    displayName: $userStore.user.displayName,
    uid: $userStore.user.uid,
  };

  let defaultOrigin = "Original Idea";
  let saveCounter = 0;

  let idea = {
    author: currentUser,
    saveCounter: 0,
    title: "",
    logline: "",
    genre: [],
    origin: defaultOrigin,
    sourceMaterial: "",
    sourceAuthors: "",
    timePeriod: "",
    setting: "",
    movieReferences: [],
    literatureReferences: [],
    premise: "",
    synopsis: "",
    comments: [],
  };

  $: ideaTitle = idea.title;

  const genreOptions = [
    "Action",
    "Adventure",
    "Art-House",
    "Biography",
    "Comedy",
    "Crime",
    "Drama",
    "Experimental",
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Horror",
    "Musical",
    "Mystery",
    "Thriller",
    "Western",
  ];

  const originOptions = [
    "Original Idea",
    "Short Story",
    "Novel",
    "Article",
    "Play",
    "Film",
  ];

  onMount(async () => {
    const pathSegments = window.location.pathname.split("/");
    ideaId = pathSegments[pathSegments.length - 1];
    console.log("Counter:", saveCounter);
    try {
      const fetchedIdea = await fetchIdea(ideaId);
      if (fetchedIdea && fetchedIdea.saveCounter !== 0) {
        console.log("fetchedIdea:", fetchedIdea);
        idea = { ...fetchedIdea, genre: fetchedIdea.genre || [] };
        userMadeChanges = false;
        await fetchCollaborators(ideaId);
        console.log("fetchedIdea:", idea);
      } else {
        const defaultIdea = { ...idea };
        console.log("deafaultIdeaData", defaultIdea);
        handleInitialSave(ideaId, defaultIdea);
        console.log("initialSavedIdea:", idea);
      }
      
    } catch (error) {
      console.error("Error loading idea:", error);
      throw new AppError("Error loading idea", 400);
    }
    isInitialLoad = false;
    console.log("Current idea.genre:", idea.genre);
    console.log("Counter:", saveCounter);
  });

  $: allCollaborators = $collaboratorStore;

  // FORM CHANGES EVENT-HANDLERS
  function handleInputChange(field, value) {
    console.log(`Input changed: field=${field}, value=${value}`);
    console.log("default origin:", defaultOrigin);
    if (field === "origin" && value === "Original Idea") {
      // Show confirmation modal here
      idea.sourceMaterial = "";
      idea.sourceAuthors = "";
    }
    userMadeChanges = true;
    idea[field] = value;
    console.log(`idea field value=${value}`);
  }

  function originModal() {}

  function handleGenreChange(detail) {
    const { value, checked } = detail;
    if (checked) {
      if (!idea.genre.includes(value)) {
        idea.genre = [...idea.genre, value];
      }
    } else {
      idea.genre = idea.genre.filter((g) => g !== value);
    }
    userMadeChanges = true;
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

  // INITIAL SAVE
  async function handleInitialSave(ideaId, defaultIdeaData) {
    console.log("Initial save triggered.");

    if (ideaId && defaultIdeaData) {
      try {
        const initialUpdate = await fetchUpdate(ideaId, defaultIdeaData);
        if (initialUpdate) {
          console.log("Initial idea saved:", initialUpdate);
          // Update the global idea object with the response
          idea = { ...defaultIdeaData, ...initialUpdate, saveCounter: 1 };
        } else {
          throw new AppError("Couldn't do initial save", { ideaId });
        }
      } catch (error) {
        throw new AppError(`An error occurred: ${error.message}`, {
          initialError: error,
        });
      }
    } else {
      console.error("Missing ideaId or defaultIdeaData");
    }
  }

  // AUTO-SAVE
  async function handleSaveIdea(currentIdeaId) {
    console.log("auto save triggered.");
    autoSavingTextDisplay();
    if (currentIdeaId && idea) {
      try {
        const updatedIdea = await fetchUpdate(ideaId, idea);
        if (updatedIdea) {
          console.log("ideaBeforeUpdate:", idea);
          if (isNaN(idea.saveCounter)) {
            idea.saveCounter = 0;
          }
          ++idea.saveCounter; // Increment the counter
          idea = { ...idea, ...updatedIdea };
          console.log("updatedIdea:", updatedIdea);
          console.log("ideaAfterUpdate:", idea);
        } else {
          throw new AppError("Couldn't update idea:", { ideaId });
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
  }, 1000);

  let autoSavingText = "";
  function autoSavingTextDisplay() {
    autoSavingText = "(Auto-Saving...)";
    setTimeout(() => {
      autoSavingText = "";
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
          <p class="saving-text">{autoSavingText}</p>
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
              placeholder="Your idea title here..."
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
          <!-- ORIGIN -->
          <div class="idea-form-element">
            <Label class="idea-element-label">Origin:</Label>
            <div class="origin-grid" id="origin-input">
              {#each originOptions as originOption}
                <RadioButtonElement
                  id={`origin-${originOption.toLowerCase()}`}
                  name="origin"
                  label={originOption}
                  value={originOption}
                  bind:selectedValue={idea.origin}
                  on:radio-button-change={(event) =>
                    handleInputChange("origin", event.detail)}
                />
              {/each}
            </div>
            <!-- SOURCE MATERIAL TITLE -->
            {#if idea.origin !== "Original Idea"}
              <div class="idea-form-element">
                <TextElement
                  id="source-material-input"
                  label="Source Material Title"
                  bind:value={idea.sourceMaterial}
                  rows={1}
                  cols={50}
                  placeholder="Ex: Romeo & Juliet"
                  on:input={() =>
                    handleInputChange("sourceMaterial", idea.sourceMaterial)}
                />
                <!-- SOURCE AUTHOR(S) -->
                <TextElement
                  id="authors-input"
                  label="Author(s)"
                  bind:value={idea.sourceAuthors}
                  rows={1}
                  cols={50}
                  placeholder="Ex: William Shakespeare"
                  on:input={() =>
                    handleInputChange("sourceAuthors", idea.sourceAuthors)}
                />
              </div>
            {/if}
            <!-- GENRE -->
            <div class="idea-form-element">
              <Label class="idea-element-label">Genre:</Label>
              <div class="genre-grid" id="genre-input">
                {#each genreOptions as genreOption}
                  <CheckboxElement
                    id={`genre-${genreOption.toLowerCase()}`}
                    name="genre"
                    value={genreOption}
                    label={genreOption}
                    bindGroup={idea.genre || []}
                    on:checkbox-input={(event) =>
                      handleGenreChange(event.detail)}
                  />
                {/each}
              </div>
            </div>
            <!-- TIME PERIOD -->
            <div class="idea-form-element">
              <TextElement
                id="time-input"
                label="Time Period"
                bind:value={idea.timePeriod}
                on:input={() =>
                  handleInputChange("timePeriod", idea.timePeriod)}
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
        </div>
      </form>
    </div>
  </div>

  <!-- COLLABORATORS -->
  <div class="collaborators">
    <Collaborators
      {ideaTitle}
      {ideaId}
      inviterInfo={currentUser}
      collaborators={allCollaborators}
    />
  </div>
</main>
