<script>
  import "./ideaform.css";
  import { Label, Input, Textarea } from "flowbite-svelte";

  export let idea = {
    title: "",
    origin: [],
    authors: [],
    genre: [],
    timePeriod: "",
    setting: "",
    filmReferences: "",
    literatureReferences: "",
    premise: "",
    logline: "",
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

  /*  let selectedOrigin = [];
  let origins = [
    { value: 'org', name: 'Original Idea' },
    { value: 'shr', name: 'Short Story' },
    { value: 'nov', name: 'Novel' },
    { value: 'art', name: 'Article' },
    { value: 'pla', name: 'Play' },
    { value: 'fil', name: 'Film'},
  ]; */

  /*   let selectedGenres = [];
  let genres = [
    { value: 'act', name: 'Action' },
    { value: 'adv', name: 'Adventure' },
    { value: 'bio', name: 'Biography' },
    { value: 'com', name: 'Comedy' },
    { value: 'cri', name: 'Crime' },
    { value: 'dra', name: 'Drama'},
    { value: 'fan', name: 'Fantasy' },
    { value: 'rom', name: 'Romance' },
    { value: 'sci', name: 'Science-Fiction' },
    { value: 'hor', name: 'Horror' },
    { value: 'mus', name: 'Musical' },
    { value: 'mys', name: 'Mystery'},
    { value: 'thr', name: 'Thriller' },
    { value: 'wes', name: 'Western' },
  ]; */

  const genreOptions = [
    "Action",
    "Adventure",
    "Biography",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Romance",
    "Science-Fiction",
    "Horror",
    "Musical",
    "Mystery",
    "Thriller",
    "Western",
  ];

  let isEditable = false;

  function toggleEdit() {
    isEditable = !isEditable;
  }

  async function saveIdeaForm() {}
</script>

<main class="global-font">
  <div class="page-title">
    <h2>New Untitled Idea</h2>
  </div>
  <div class="idea-edit-button-container">
    <button class="form-edit-button" type="button" on:click={toggleEdit}>
      {isEditable ? "Save" : "Edit"}
    </button>
  </div>
  <div class="idea-form-container">
    <form on:submit|preventDefault>
      <div class="idea-form-elements-container">
        <div class="idea-form-element">
          <Label class="idea-form-element-label" for="title-input">Title:</Label
          >
          <div>
            <Input
              class="idea-input-field"
              id="title-input"
              size="sm"
              bind:value={idea.title}
              disabled={!isEditable}
              rows="1"
              cols="50"
            />
          </div>
        </div>
        <div class="idea-form-element">
          <Label class="idea-form-element-label" for="origin-input"
            >Origin:</Label
          >
          <div class="origin-grid">
            {#each originOptions as originOption}
              <div>
                <input
                  type="checkbox"
                  id={`origin-${originOption.toLowerCase()}`}
                  value={originOption}
                  bind:group={idea.origin}
                  disabled={!isEditable}
                />
                <Label for={`origin-${originOption.toLowerCase()}`}
                  >{originOption}</Label
                >
              </div>
            {/each}
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label" for="authors-input"
              >Authors (if any):</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="authors-input"
                bind:value={idea.authors}
                disabled={!isEditable}
                rows="1"
                cols="50"
              />
            </div>
          </div>
          <div class="idea-form-element">
            <Label class="idea-form-element-label genre-grid" for="genre-input"
              >Genre:</Label
            >
            <div class="genre-grid">
            {#each genreOptions as genreOption}
              <div>
                <input
                  type="checkbox"
                  id={`genre-${genreOption.toLowerCase()}`}
                  value={genreOption}
                  bind:group={idea.genre}
                  disabled={!isEditable}
                />
                <Label for={`genre-${genreOption.toLowerCase()}`}
                  >{genreOption}</Label
                >
              </div>
            {/each}
            </div>
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
            <Label class="idea-form-element-label" for="logline-input"
              >Logline:</Label
            >
            <div>
              <textarea
                class="idea-input-field"
                id="logline-input"
                bind:value={idea.logline}
                disabled={!isEditable}
                rows="4"
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
