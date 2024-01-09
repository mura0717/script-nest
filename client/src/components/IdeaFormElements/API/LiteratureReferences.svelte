<script>
  import { Search, Label, Dropdown, DropdownItem } from "flowbite-svelte";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import "./api-refs.css";
  import "../../../pages/Idea/idea.css";
  import debounce from "debounce";
  import { AppError } from "../../../utils/ErrorHandling/AppError";
  import { handleError } from "../../../utils/ErrorHandling/GlobalErrorHandlerClient";
  import { createEventDispatcher } from "svelte";

  let bookSearchResults = [];
  let selectedBooks = [];
  let showDropdown = false;
  const litRefDispatch = createEventDispatcher();

  async function fetchBooks(query) {
    try {
      const response = await getRequest(
        `/api/ideas/books?q=${encodeURIComponent(query)}`
      );
      if (response && response.bookId && response.bookId.items) {
        console.log("LitRef-google book api response:", response);
        return response.bookId.items.slice(0, 5).map((item) => ({
          thumbnail: item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.smallThumbnail
            : default_image_thumbnail,
          title: item.volumeInfo.title || "No title available",
          authors: item.volumeInfo.authors || ["Unknown author(s)"],
          publishedDate: item.volumeInfo.publishedDate
            ? item.volumeInfo.publishedDate.substring(0, 4)
            : "No publication date",
        }));
      } else {
        throw new AppError("No data found from Google Books", { query });
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function searchBooks(bookName) {
    if (bookName.length > 0) {
      try {
        const results = await fetchBooks(bookName);
        bookSearchResults = results;
        showDropdown = true;
      } catch (error) {
        handleError(error);
        throw new AppError(`An error occured: ${error.message}`, {
          initialError: error,
        });
      }
    } else {
      bookSearchResults = [];
    }
  }

  const debouncedSearchBooks = debounce(searchBooks, 500);

  async function selectBook(book) {
    console.log(book);
    try {
      if (book) {
        const bookReference = {
          coverImageUrl: book.thumbnail,
          title: book.title,
          authors: book.authors.join(", "),
          publishedDate: book.publishedDate,
        };

        selectedBooks = [...selectedBooks, book];
        litRefDispatch("updateLitRefs", selectedBooks)
        bookSearchResults = [];
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function removeBook(index) {
    selectedBooks = selectedBooks.filter((_, i) => i !== index);
  }
</script>

<div>
  <Label class="idea-element-label" for="literature-references-input"
    >Literature References:</Label
  >
  <form class="search-bar">
    <Search
      size="md"
      on:input={(event) => debouncedSearchBooks(event.target.value)}
    />
    {#if bookSearchResults.length > 0}
      <Dropdown class="dropdown" size="md" bind:open={showDropdown}>
        {#each bookSearchResults as book}
          <DropdownItem class="dropdown-item" on:click={() => selectBook(book)}>
            <img class="ref-thumbnail" src={book.thumbnail} alt={book.title} />
            {book.title}
            ({book.authors})
          </DropdownItem>
        {/each}
      </Dropdown>
    {/if}
  </form>

  {#if selectedBooks}
    <div class="refs-display">
      {#each selectedBooks as book, index}
        <div class="ref-item">
          <div class="ref-cover-display">
            <img
              src={book.thumbnail}
              alt={book.title}
              class="ref-cover-image"
            />
          </div>
          <!-- DETAILS on HOVER -->
          <div class="ref-details">
            <p>{book.title}</p>
            <p>({book.authors.join(", ")},</p>
            <p>{book.publishedDate})</p>
          </div>
          <button class="remove-ref-button" on:click={() => removeBook(index)}
            >X
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
