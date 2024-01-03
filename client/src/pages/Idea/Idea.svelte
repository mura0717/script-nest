<script>
  import "./idea.css";
  import { Label } from "flowbite-svelte";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBox/CheckboxElement.svelte";
  import RadioButtonElement from '../../components/IdeaFormElements/RadioButton/RadioButtonElement.svelte';
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import FilmReferences from "../../components/IdeaFormElements/API/FilmReferences.svelte";

  let isEditable = false;

   function toggleEdit() {
    isEditable = !isEditable;
  }
  
  export let idea = {
    title: "",
    selectedOrigin: "",
    sourceMaterial: "",
    authors: "",
    selectedGenres: [],
    timePeriod: "",
    setting: "",
    filmReferences: "",
    literatureReferences: "",
    premise: "",
    synopsis: "",
    comments: "",
  };
  
  let localOriginValue = idea.selectedOrigin;
  localOriginValue = "Original Idea";
  
  function handleOriginChange(event) {
    localOriginValue = event.currentTarget.value;
  }

  const originOptions = [
    "Original Idea",
    "Short Story",
    "Novel",
    "Article",
    "Play",
    "Film",
  ];

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

  async function saveIdeaForm() {}

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
            placeholder=""
            disabled={!isEditable}
          />
        </div>
         <!-- ORIGIN -->
        <div class="idea-form-element">
        <div class="idea-element-label">
          <Label class="idea-element-label"
            >Origin:</Label
          >
          <div class="origin-grid">
            {#each originOptions as originOption}
              <RadioButtonElement
                id={`origin-${originOption.toLowerCase()}`}
                name="origin"
                label={originOption}
                value={originOption}
                selectedValue={localOriginValue}
                onChange={handleOriginChange}
                disabled={!isEditable}
              />
            {/each}
          </div>
          </div>
          <!-- SOURCE MATERIAL TITLE -->
          {#if localOriginValue !== "Original Idea"}
          <div class="idea-form-element">
            <TextElement
              id="origin-input"
              label="Source Material Title"
              bind:value={idea.sourceMaterial}
              rows={1}
              cols={50}
              placeholder="Ex: Romeo & Juliet"
              disabled={!isEditable}
            />
            <!-- SOURCE AUTHOR(S) -->
            <TextElement
              id="authors-input"
              label="Author(s)"
              bind:value={idea.authors}
              rows={1}
              cols={50}
              placeholder="Ex: William Shakespeare"
              disabled={!isEditable}
            />
          </div>
          {/if}
           <!-- GENRE -->
          <div class="idea-form-element">
          <Label class="idea-element-label" for="genre-input"
            >Genre:</Label
          >
          <div class="genre-grid">
            {#each genreOptions as genreOption}
              <CheckboxElement
                id={`genre-${genreOption.toLowerCase()}`}
                value={genreOption}
                label={genreOption}
                bind:bindGroup={idea.selectedGenres}
                disabled={!isEditable}
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
            disabled={!isEditable}
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
            disabled={!isEditable}
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
            disabled={!isEditable}
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
            disabled={!isEditable}
          />
          </div>
           <!-- LITERATURE REFERENCES -->
          <div class="idea-form-element">
             <LiteratureReferences /> <!-- Needs to be implemented correctly!!! -->     
          </div>
          <!-- FILM REFERENCES -->
          <div class="idea-form-element">
            <FilmReferences />
          </div>
          <!-- COMMENTS -->
          <div class="idea-form-element">
             <TextElement
            id="comments-input"
            label="Comments"
            bind:value={idea.comments}
            rows={4}
            cols={50}
            placeholder="Ex: I think the first part drags a little..."
            disabled={!isEditable}
          />
          </div>
        </div>
      </div>
    </form>
  </div>
</main>
