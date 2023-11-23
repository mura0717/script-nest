<script>
  import "./IdeaForm.css";

  export let idea = {
    title: "",
    origin: "",
    authors: "",
    genre: "",
    time: "",
    setting: "",
    filmReferences: "",
    literatureReferences: "",
    premise: "",
    logline: "",
    synopsis: "",
    comments: "",
  };

  let isEditable = false;

  function toggleEdit() {
    isEditable = !isEditable;
  }
</script>

<body>
  <main>
    <div class="form-container">
      <form on:submit|preventDefault>
        <div class="button-area">
          <button class="form-edit-button" type="button" on:click={toggleEdit}>
            {isEditable ? "Save" : "Edit"}
          </button>
        </div>
        <div class="form-elements">
          <div>
            <label for="title-input">Title:</label>
            <input
              id="title-input"
              bind:value={idea.title}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="origin-input">Origin:</label>
            <input
              id="origin-input"
              bind:value={idea.origin}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="authors-input">Authors:</label>
            <input
              id="authors-input"
              bind:value={idea.authors}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="genre-input">Genre:</label>
            <input
              id="genre-input"
              bind:value={idea.genre}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="time-input">Time:</label>
            <input
              id="time-input"
              bind:value={idea.time}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="setting-input">Setting:</label>
            <input
              id="setting-input"
              bind:value={idea.setting}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="premise-input">Premise:</label>
            <input
              id="premise-input"
              bind:value={idea.premise}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="logline-input">Logline:</label>
            <input
              id="logline-input"
              bind:value={idea.logline}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="synopsis-input">Synopsis:</label>
            <input
              id="synopsis-input"
              bind:value={idea.synopsis}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="film-references-input">Film References:</label>
            <input
              id="film-references-input"
              bind:value={idea.filmReferences}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="literature-references-input"
              >Literature References:</label
            >
            <input
              id="literature-references-input"
              bind:value={idea.literatureReferences}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label for="comments-input">Comments:</label>
            <input
              id="comments-input"
              bind:value={idea.comments}
              disabled={!isEditable}
            />
          </div>
        </div>
      </form>
    </div>
  </main>
</body>
