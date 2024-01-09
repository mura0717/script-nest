<script>
  import "./idea.css";
  import { Label } from "flowbite-svelte";
  import debounce from "debounce";
  import TextElement from "../../components/IdeaFormElements/TextElement/TextElement.svelte";
  import CheckboxElement from "../../components/IdeaFormElements/CheckBox/CheckboxElement.svelte";
  import RadioButtonElement from "../../components/IdeaFormElements/RadioButton/RadioButtonElement.svelte";
  import LiteratureReferences from "../../components/IdeaFormElements/API/LiteratureReferences.svelte";
  import FilmReferences from "../../components/IdeaFormElements/API/FilmReferences.svelte";

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


    /* const saveIdea = debounce(async () => {
    console.log("Auto-saving:", idea);
  }, 5 000);*/


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
            <LiteratureReferences />
            <!-- Needs to be implemented correctly!!! -->
          </div>
          <!-- FILM REFERENCES -->
          <div class="idea-form-element" id="film-ref-input">
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
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</main>
