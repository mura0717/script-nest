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
  let initialSaveCount = 0;

  let idea = {
    author: currentUser,
    saveCount: initialSaveCount,
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
    console.log("first onMount Counter:", initialSaveCount);
    try {
      const fetchedIdea = await fetchIdea(ideaId);
      if (
        fetchedIdea &&
        (fetchedIdea.saveCount === 0 || fetchedIdea.saveCount === undefined)
      ) {
        const defaultIdea = { ...idea };
        HandleInitialSave(ideaId, defaultIdea);
      } else if (fetchIdea) {
        idea = { ...fetchedIdea, genre: fetchedIdea.genre || [], origin: fetchedIdea.origin || defaultOrigin};
        userMadeChanges = false;
        await fetchCollaborators(ideaId);
      }
    } catch (error) {
      console.error("Error loading idea:", error);
      throw new AppError("Error loading idea", 400);
    }
    isInitialLoad = false;
    console.log("Current idea.genre:", idea.genre);
  });

  $: allCollaborators = $collaboratorStore;

  // FORM CHANGES EVENT-HANDLERS
  function HandleInputChange(field, value) {
    console.log(`Input changed: field=${field}, value=${value}`);
    userMadeChanges = true;
    idea[field] = value;
    console.log(`idea field value=${value}`);
  }

  
    
  function HandleOriginChange(field, value) {
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

  function OriginModal() {}

  function HandleGenreChange(detail) {
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

  function HandleLitRefsUpdate(updatedLitRefs) {
    userMadeChanges = true;
    idea = { ...idea, literatureReferences: updatedLitRefs.detail };
  }

  function HandleMovieRefsUpdate(updatedMovieRefs) {
    userMadeChanges = true;
    idea = { ...idea, movieReferences: updatedMovieRefs.detail };
  }

  function HandleCommentsUpdate(updatedComments) {
    userMadeChanges = true;
    idea = { ...idea, comments: updatedComments.detail };
  }

  // INITIAL SAVE
  async function HandleInitialSave(ideaId, defaultIdea) {
    if (ideaId && defaultIdea) {
      try {
        const initialUpdate = await fetchUpdate(ideaId, defaultIdea);
        if (initialUpdate) {
          idea = { ...defaultIdea, ...initialUpdate, saveCount: 1 };
          console.log("Initial idea saved:", initialUpdate);
          console.log("Save Count after initial save:", idea.saveCount);
        } else {
          throw new AppError("Couldn't do initial save", { ideaId });
        }
      } catch (error) {
        throw new AppError(`An error occurred: ${error.message}`, {
          initialError: error,
        });
      }
    } else {
      console.error("Missing ideaId or defaultIdea");
    }
  }

  // AUTO-SAVE
  async function HandleSaveIdea(currentIdeaId) {
    console.log("auto save triggered.");
    AutoSavingTextDisplay();
    if (currentIdeaId && idea) {
      try {
        const updatedIdea = await fetchUpdate(ideaId, idea);
        if (updatedIdea) {
          console.log("ideaBeforeUpdate:", idea);
          if (isNaN(idea.saveCount)) {
            idea.saveCount = 0;
          }
          ++idea.saveCount; // Increment the counter
          idea = { ...idea, ...updatedIdea };
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
      HandleSaveIdea(ideaId);
      userMadeChanges = false;
    }
  }, 1000);

  let autoSavingText = "";
  function AutoSavingTextDisplay() {
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
              on:input={() => HandleInputChange("title", idea.title)}
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
              on:input={() => HandleInputChange("premise", idea.premise)}
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
              on:input={() => HandleInputChange("logline", idea.logline)}
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
                    HandleOriginChange("origin", event.detail)}
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
                    HandleInputChange("sourceMaterial", idea.sourceMaterial)}
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
                    HandleInputChange("sourceAuthors", idea.sourceAuthors)}
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
                      HandleGenreChange(event.detail)}
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
                  HandleInputChange("timePeriod", idea.timePeriod)}
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
                on:input={() => HandleInputChange("setting", idea.setting)}
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
                on:input={() => HandleInputChange("synopsis", idea.synopsis)}
                rows={15}
                cols={50}
                placeholder="A detailed description of the plot goes here..."
              />
            </div>
            <!-- BOOK REFERENCES -->
            <div class="idea-form-element" id="book-ref-input">
              <LiteratureReferences
                bind:literatureReferences={idea.literatureReferences}
                on:updateLitRefs={HandleLitRefsUpdate}
              />
            </div>
            <!-- FILM REFERENCES -->
            <div class="idea-form-element" id="film-ref-input">
              <MovieReferences
                bind:movieReferences={idea.movieReferences}
                on:updateMovieRefs={HandleMovieRefsUpdate}
              />
            </div>
            <!-- COMMENTS -->
            <div class="idea-form-element">
              <Comments
                bind:comments={idea.comments}
                on:updateComments={HandleCommentsUpdate}
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
