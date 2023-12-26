<script>
  import "./idea-form.css";
  import { Label } from "flowbite-svelte";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBox/CheckboxElement.svelte";
  import RadioButtonElement from './../../components/IdeaFormElements/RadioButton/RadioButtonElement.svelte';

  let isEditable = false;

   function toggleEdit() {
    isEditable = !isEditable;
  }

  async function saveIdeaForm() {}
  
  export let idea = {
    title: "",
    origin: "",
    sourceMaterial: "",
    authors: "",
    genre: [],
    timePeriod: "",
    setting: "",
    filmReferences: "",
    literatureReferences: "",
    premise: "",
    synopsis: "",
    comments: "",
  };

  const originOptions = [
    "Original Idea",
    "Short Story",
    "Novel",
    "Article",
    "Play",
    "Film",
  ];

  let selectedOrigin = '';

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

  let selectedGenres = [];

</script>

<main class="global-font">
  <!-- PAGE TITLE (IDEA) -->
  <div class="page-title">
    <p>{idea.title || "Untitled New Idea"}</p>
  </div>
  <!-- EDIT BUTTON -->
  <div class="idea-edit-button-container">
    <button class="form-edit-button" type="button" on:click={toggleEdit}>
      {isEditable ? "Save" : "Edit"}
    </button>
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
            disabled={!isEditable}
          />
        </div>
         <!-- ORIGIN -->
        <div class="idea-element-label">
          <Label class="idea-element-label" for="origin-input"
            >Origin:</Label
          >
          <div class="origin-grid">
            {#each originOptions as originOption}
              <RadioButtonElement
                id={`origin-${originOption.toLowerCase()}`}
                name="origin"
                value={originOption}
                label={originOption}
                bind:group={selectedOrigin}
                disabled={!isEditable}
              />
            {/each}
          </div>
          <!-- SOURCE MATERIAL -->
          <div class="idea-form-element">
            <TextElement
              id="origin-input"
              label="Source Material Title"
              bind:value={idea.sourceMaterial}
              rows={1}
              cols={50}
              disabled={!isEditable}
            />
            <!-- SOURCE AUTHOR(S) -->
            <TextElement
              id="authors-input"
              label="Author(s)"
              bind:value={idea.authors}
              rows={1}
              cols={50}
              disabled={!isEditable}
            />
          </div>
           <!-- GENRE -->
          <div class="idea-form-element">
            
          <div class="idea-element-label">
          <Label class="idea-element-label" for="genre-input"
            >Genre:</Label
          >
          <div class="genre-grid">
            {#each genreOptions as genreOption}
              <CheckboxElement
                id={`origin-${genreOption.toLowerCase()}`}
                value={genreOption}
                label={genreOption}
                bind:group={selectedGenres}
                disabled={!isEditable}
              />
            {/each}
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="time-period-input"
              >Time Period:</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="time-input"
                bind:value={idea.timePeriod}
                disabled={!isEditable}
                rows="1"
                cols="50"
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="setting-input"
              >Setting:</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="setting-input"
                bind:value={idea.setting}
                disabled={!isEditable}
                rows="1"
                cols="50"
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="premise-input"
              >Premise:</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="premise-input"
                bind:value={idea.premise}
                disabled={!isEditable}
                rows="2"
                cols="50"
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="synopsis-input"
              >Synopsis:</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="synopsis-input"
                bind:value={idea.synopsis}
                disabled={!isEditable}
                rows="4"
                cols="50"
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="film-references-input"
              >Film References:</Label
            >
            <div>
              <input
                class="idea-input-field"
                id="film-references-input"
                bind:value={idea.filmReferences}
                disabled={!isEditable}
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label
              class="idea-form-element-label"
              for="literature-references-input">Literature References:</Label
            >
            <div>
              <input
                class="idea-input-field"
                id="literature-references-input"
                bind:value={idea.literatureReferences}
                disabled={!isEditable}
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="comments-input"
              >Comments:</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="comments-input"
                bind:value={idea.comments}
                disabled={!isEditable}
                rows="4"
                cols="50"
                placeholder="Leave a comment..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</main>
