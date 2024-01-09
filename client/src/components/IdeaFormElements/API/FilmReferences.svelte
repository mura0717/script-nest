<script>
  import { Search, Label, Dropdown, DropdownItem } from "flowbite-svelte";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import "./api-refs.css";
  import "../../../pages/Idea/idea.css";
  import debounce from "debounce";
  import { AppError } from "../../../utils/ErrorHandling/AppError";
  import { handleError } from "../../../utils/ErrorHandling/GlobalErrorHandlerClient";

  const currentIdeaId = "";
  let movieSearchResults = [];
  let selectedMovies = [];
  let showDropdown = false;

  async function fetchMovies(query) {
    try {
      const response = await getRequest(`/api/ideas/movies?q=${encodeURIComponent(query)}`);
      if (response && response.filmId && response.filmId.results) {
        console.log("LitRef-google movie api response:", response);
        return response.filmId.results.slice(0, 5).map((item) => ({
          thumbnail: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : default_image_thumbnail,
          title: item.title || "No title available",
          releaseDate: item.release_date ? item.release_date.substring(0,4) : "No publication date",
        }));
      } else {
        throw new AppError("No data found from TMDB", { query });
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function searchMovies(movieName) {
    if (movieName.length > 0) {
      try {
        const results = await fetchMovies(movieName);
        movieSearchResults = results;
        showDropdown = true;
      } catch (error) {
        handleError(error);
        throw new AppError(`An error occured: ${error.message}`, {
          initialError: error,
        });
      }
    } else {
      movieSearchResults = [];
    }
  }

  const debouncedSearchMovies = debounce(searchMovies, 500);

  async function selectMovie(movie) {
    console.log(movie);
    try {
      if (movie) {
        const movieReference = {
          coverImageUrl: movie.thumbnail,
          title: movie.title,
          releaseDate: movie.releaseDate,
        };

        selectedMovies = [...selectedMovies, movie];
        movieSearchResults = [];
        //await postRequest(`/api/ideas/${currentIdeaId}/books`, bookReference);
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function removeFilm(index) {
    selectedMovies = selectedMovies.filter((_, i) => i !== index);
  }
</script>

<div>
  <Label class="idea-element-label" for="film-references-input"
    >Film References:</Label
  >
  <form class="search-bar">
    <Search
      size="md"
      on:input={(event) => debouncedSearchMovies(event.target.value)}
    />
    {#if movieSearchResults.length > 0}
      <Dropdown class="dropdown" size="md" bind:open={showDropdown}>
        {#each movieSearchResults as movie}
          <DropdownItem class="dropdown-item" on:click={() => selectMovie(movie)}>
            <img class="ref-thumbnail" src={movie.thumbnail} alt={movie.title} />
            {movie.title}
            ({movie.releaseDate})
          </DropdownItem>
        {/each}
      </Dropdown>
    {/if}
  </form>

  {#if selectedMovies}
    <div class="refs-display">
      {#each selectedMovies as movie, index}
        <div class="ref-item">
          <div class="ref-cover-display">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              class="ref-cover-image"
            />
          </div>
          <!-- DETAILS on HOVER -->
          <div class="ref-details">
            <p>{movie.title}</p>
            <p>({movie.releaseDate})</p>
          </div>
          <button class="remove-ref-button" on:click={() => removeFilm(index)}
            >X
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
