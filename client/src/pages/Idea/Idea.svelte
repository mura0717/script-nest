<script>
  import "./idea.css";
  import { Label } from "flowbite-svelte";
  import debounce from "debounce";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBox/CheckboxElement.svelte";
  import RadioButtonElement from "../../components/IdeaFormElements/RadioButton/RadioButtonElement.svelte";
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import MovieReferences from "../../components/IdeaFormElements/API/MovieReferences.svelte";
  import Comments from "../../components/IdeaFormElements/CommentElement/Comments.svelte";
  import Collaborators from "../../components/IdeaFormElements/CollaboratorElement/Collaborators.svelte";

  export let idea = {
    title: "",
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

  function handleOriginChange(event) {
    localOriginValue = event.currentTarget.value;
  }

  function handleLitRefsUpdate(updatedLitRefs) {
    console.log(
      "Idea Page - Before handleLitRefsUpdate:",
      idea.literatureReferences
    );
    idea.literatureReferences = updatedLitRefs;
    console.log(
      "Idea Page - After handleLitRefsUpdate:",
      idea.literatureReferences
    );
  }

  function handleMovieRefsUpdate(updatedMovieRefs) {
    console.log(
      "Idea Page - Before handleMovieRefsUpdate:",
      idea.movieReferences
    );
    idea.movieReferences = updatedMovieRefs;
    console.log(
      "Idea Page - After handleMovieRefsUpdate:",
      idea.movieReferences
    );
  }

  function handleCommentsUpdate(updatedComments) {
    console.log("Idea Page - Before handleCommentsUpdate:", idea.comments);
    idea.comments = updatedComments;
    console.log("Idea Page - After handleCommentsUpdate:", idea.comments);
  }

  async function saveIdea() {
    console.log("Auto-saving:", idea);
  }

  const debouncedSaveIdea = debounce(saveIdea, 5000);

  $: if (idea) {
    debouncedSaveIdea();
  }
</script>

<main class="global-font">
  <!-- PAGE TITLE (IDEA) -->
  <div class="page-title">
    <p>{idea.title || "Untitled New Idea"}</p>
  </div>

  <!-- COLLABORATORS -->
  <div>
    <Collaborators/>
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
        <!-- ORIGIN -->
        <div class="idea-form-element">
          <div class="idea-element-label">
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
              placeholder="Ex: An age-old vendetta between two powerful families erupts into bloodshed..."
            />
          </div>
          <!-- LITERATURE REFERENCES -->
          <div class="idea-form-element" id="lit-ref-input">
            <LiteratureReferences on:updateLitRefs={handleLitRefsUpdate} />
            <!-- Needs to be implemented correctly!!! -->
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
</main>
