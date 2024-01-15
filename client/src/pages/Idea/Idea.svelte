<script>
  import { onMount } from "svelte";
  import { useParams } from "svelte-navigator";
  import { userStore } from "../../store/userStore";
  import { ideaStore } from "../../store/ideaStore.js";
  import { fetchIdea } from "../../store/ideaFetchStore.js";
  import { AppError } from "../../utils/ErrorHandling/AppError.js";
  import { handleError } from "../../utils/ErrorHandling/GlobalErrorHandlerClient.js";
  import * as fetchStore from "../../store/fetchStore";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBox/CheckboxElement.svelte";
  import RadioButtonElement from "../../components/IdeaFormElements/RadioButton/RadioButtonElement.svelte";
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import MovieReferences from "../../components/IdeaFormElements/API/MovieReferences.svelte";
  import Comments from "../../components/IdeaFormElements/CommentElement/Comments.svelte";
  import Collaborators from "../../components/IdeaFormElements/CollaboratorElement/Collaborators.svelte";
  import debounce from "debounce";
  import "./idea.css";
  import "../../styles/global.css";
  import { Label } from "flowbite-svelte";

  const params = useParams();
  console.log("params:", params);
  console.log("params.ideaId:", params.ideaId);
  let ideaId = params.ideaId;
  console.log("params.ideaId:", ideaId);

  let owner = {
    photoURL: $userStore.user.photoURL,
    displayName: $userStore.user.displayName,
    uid: $userStore.user.uid,
  };

  export let idea = {
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

  let ideaTitle = idea.title;
  $: ideaTitle = idea.title;

  const originOptions = [
    "Original Idea",
    "Short Story",
    "Novel",
    "Article",
    "Play",
    "Film",
  ];

  let localOriginValue = idea.selectedOrigin;
  localOriginValue = "Original Idea";

  const genreOptions = [
    "Action",
    "Adventure",
    "Biography",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Horror",
    "Musical",
    "Mystery",
    "Thriller",
    "Western",
  ];

  export function getIdeaPageId() {}

  onMount(async () => {
    if (ideaId) {
      idea = await fetchIdea(ideaId);
      ideaStore.setIdea(idea);
    } else {
      throw new AppError(`Error reading the idea with id:${ideaId}`, 400);
    }
  });

  function handleOriginChange(event) {
    localOriginValue = event.currentTarget.value;
  }

  function handleCollaboratorsUpdate(updateCollaborators) {
    console.log(
      "Idea Page - Before handleCollaboratorsUpdate:",
      idea.collaborators
    );
    idea.collaborators = updateCollaborators;
    console.log(
      "Idea Page - After handleCollaboratorsUpdate:",
      idea.collaborators
    );
  }

  function handleLitRefsUpdate(updatedLitRefs) {
    idea.literatureReferences = updatedLitRefs;
  }

  function handleMovieRefsUpdate(updatedMovieRefs) {
    idea.movieReferences = updatedMovieRefs;
  }

  function handleCommentsUpdate(updatedComments) {
    console.log("Idea Page - Before handleCommentsUpdate:", idea.comments);
    idea.comments = updatedComments;
    console.log("Idea Page - After handleCommentsUpdate:", idea.comments);
  }

  async function saveIdea(ideaId) {
    if(!ideaId){
      console.error("Idea ID is undefined");
    }
    console.log("IdeaPage/Auto-saving Idea:", idea);
    try {
      const saveIdeaResponse = await fetchStore.patchRequest(
        `/api/auth/ideas/${ideaId}`, idea
      );
      if (saveIdeaResponse) {
        autoSavingMessageDisplay();
      } else {
        throw new AppError("Couldn't update idea", { ideaId });
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  $: autoSavingText = "";

  function autoSavingMessageDisplay() {
    autoSavingText = "(Saving...)";
    setTimeout(() => {
      autoSavingText = "";
    }, 3000);
  }

  const debouncedSaveIdea = debounce(saveIdea, 5000);

  $: if (idea) {
    debouncedSaveIdea();
  }
</script>

<main class="idea-page-container global-font">
  <!-- IDEA TITLE -->
  <div class="idea-container">
    <div class="idea-title">
      <p>{ideaTitle || "Untitled New Idea"}</p>
    </div>
    <div>
      <p size="xs">{autoSavingText}</p>
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
                  selectedValue={localOriginValue}
                  onChange={handleOriginChange}
                />
              {/each}
            </div>
            <!-- SOURCE MATERIAL TITLE -->
            {#if localOriginValue !== "Original Idea"}
              <div class="idea-form-element">
                <TextElement
                  id="source-material-input"
                  label="Source Material Title"
                  bind:value={idea.sourceMaterial}
                  rows={1}
                  cols={50}
                  placeholder="Ex: Romeo & Juliet"
                />
                <!-- SOURCE AUTHOR(S) -->
                <TextElement
                  id="authors-input"
                  label="Author(s)"
                  bind:value={idea.authors}
                  rows={1}
                  cols={50}
                  placeholder="Ex: William Shakespeare"
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
                    bind:bindGroup={idea.selectedGenres}
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
                id="synopis-input"
                label="Synopsis"
                bind:value={idea.synopsis}
                rows={15}
                cols={50}
                placeholder="A detailed description of the plot goes here..."
              />
            </div>
            <!-- LITERATURE REFERENCES -->
            <div class="idea-form-element" id="lit-ref-input">
              <LiteratureReferences on:updateLitRefs={handleLitRefsUpdate} />
            </div>
            <!-- FILM REFERENCES -->
            <div class="idea-form-element" id="film-ref-input">
              <MovieReferences on:updateMovieRefs={handleMovieRefsUpdate} />
            </div>
            <!-- COMMENTS -->
            <div class="idea-form-element">
              <Comments on:updateComments={handleCommentsUpdate} />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- COLLABORATORS -->
  <div>
    <Collaborators
      {ideaTitle}
      on:updateCollaborators={handleCollaboratorsUpdate}
    />
  </div>
</main>
