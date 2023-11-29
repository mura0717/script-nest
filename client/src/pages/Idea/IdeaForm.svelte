<script>
  import "./IdeaForm.css";

  export let idea = {
    title: '',
    origin: [],
    authors: [],
    genre: [],
    timePeriod: '',
    setting: '',
    filmReferences: '',
    literatureReferences: '',
    premise: '',
    logline: '',
    synopsis: '',
    comments: '',
  };

  const originOptions = [
    "Original Idea",
    "Short Story",
    "Novel",
    "Article",
    "Play",
    "Film",
  ];
  
  const genreOptions = [
    "Drama",
    "Comedy",
    "Romance",
    "Thriller",
    "Action",
    "Horror",
  ];

  let isEditable = false;

  function toggleEdit() {
    isEditable = !isEditable;
  }
</script>

<body>
  <main class="global-font">
    <div class="idea-edit-button-container">
      <button class="form-edit-button" type="button" on:click={toggleEdit}>
        {isEditable ? "Save" : "Edit"}
      </button>
    </div>
    <div class="idea-form-container">
      <form on:submit|preventDefault>
        <div class="idea-form-elements-container">
          <div class="idea-form-element">
            <label class="idea-form-element-label" for="title-input">Title:</label>
            <div>
              <textarea
                class="idea-input-field"
                id="title-input"
                bind:value={idea.title}
                disabled={!isEditable}
                rows="1"
                cols="50"
              />
            </div>
          </div>
          <div class="idea-form-element">
            <label class="idea-form-element-label" for="origin-input">Origin:</label>
            {#each originOptions as originOption}
              <div>
                <input
                  type="checkbox"
                  id={`origin-${originOption.toLowerCase()}`}
                  value={originOption}
                  bind:group={idea.origin}
                  disabled={!isEditable}
                />
                <label for={`origin-${originOption.toLowerCase()}`}
                  >{originOption}</label
                >
              </div>
            {/each}
          </div>
          <div class="idea-form-element">
            <label class="idea-form-element-label" for="authors-input">Authors (if any):</label>
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
            <label class="idea-form-element-label" for="genre-input">Genre:</label>
              {#each genreOptions as genreOption}
              <div>
                <input
                  type="checkbox"
                  id={`genre-${genreOption.toLowerCase()}`}
                  value={genreOption}
                  bind:group={idea.genre}
                  disabled={!isEditable}
                />
                <label for={`genre-${genreOption.toLowerCase()}`}
                  >{genreOption}</label
                >
              </div>
            {/each}
          </div>
          <div class="idea-form-element">
            <label class="idea-form-element-label" for="time-period-input">Time Period:</label>
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
            <label class="idea-form-element-label" for="setting-input">Setting:</label>
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
            <label class="idea-form-element-label" for="premise-input">Premise:</label>
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
            <label class="idea-form-element-label" for="logline-input">Logline:</label>
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
            <label class="idea-form-element-label" for="synopsis-input">Synopsis:</label>
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
            <label class="idea-form-element-label" for="film-references-input">Film References:</label>
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
            <label class="idea-form-element-label" for="literature-references-input"
              >Literature References:</label
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
            <label class="idea-form-element-label" for="comments-input">Comments:</label>
            <div>
              <textarea
                class="idea-input-field"
                id="comments-input"
                bind:value={idea.comments}
                disabled={!isEditable}
                rows="4"
                cols="50"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</body>
