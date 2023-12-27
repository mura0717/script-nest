<script>
  import { Search, Label } from "flowbite-svelte";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import "./references.css";
  import "../../../pages/Idea/idea.css";

  const currentIdeaId = "";
  let films = [];
  let selectedFilm;

  async function searchFilms(query) {
    films = await getRequest(`/api/ideas/films?q=${encodeURIComponent(query)}`);
  }

  async function selectFilm(film) {
    selectedFilm = film;
    const bookReference = {
      coverImageUrl: film.postRequest,
      title: film.title,
      publicationDatae: film.date,
      authors: film.writer,
    };

    await postRequest(`/api/ideas/${currentIdeaId}/films`, bookReference);
  }
</script>

<div>
  <Label class="idea-element-label"for="film-references-input">Film References:</Label>
  <form class="flex gap-2">
    <Search size="md" on:input={(event) => searchFilms(event.target.value)} />
    {#if films.length > 0}
      <div class="dropdown">
        {#each films as film}
          <div class="dropdown-item" on:click={() => selectFilm(film)}>
            {film.title}
          </div>
        {/each}
      </div>
    {/if}
  </form>

  {#if selectedFilm}
    <div class="film-display">
      <img
        src={selectedFilm.poster}
        alt={selectedFilm.title}
      />
      <!-- Hidden details to show on hover -->
      <div class="film-details">
        <p>{selectedFilm.title}</p>
        <p>{selectedFilm.publishedDate}</p>
        <p>{selectedFilm.authors.join(", ")}</p>
      </div>
    </div>
  {/if}
</div>
