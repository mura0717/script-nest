<script>
  import "./api-refs.css";
  import "../../../styles/global.css";
  import "../../../pages/Idea/idea.css";
  import {
    Search,
    Label,
    Dropdown,
    DropdownItem,
    Modal,
    Button,
  } from "flowbite-svelte";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  import default_image_thumbnail from "../../../assets/defaultImages/default_image_thumbnail.jpeg";
  import { getRequest } from "../../../store/fetchStore";
  import debounce from "debounce";
  import { AppError } from "../../../utils/ErrorHandling/AppError";
  import { handleError } from "../../../utils/ErrorHandling/GlobalErrorHandlerClient";
  import { createEventDispatcher, onMount } from "svelte";

  let searchBookName = "";
  let bookSearchResults = [];
  let selectedBooks = [];
  let showDropdown = false;
  let currentBookIndex;
  let showRemoveBookModal = false;
  export let literatureReferences = [];
  const litRefDispatch = createEventDispatcher();

  $: if (Array.isArray(literatureReferences)) {
    selectedBooks = [...literatureReferences];
  }

  async function fetchBooks(searchQuery) {
    try {
      const response = await getRequest(
        `/api/auth/books/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response && response.bookId && response.bookId.items) {
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
        throw new AppError("No data found from Google Books", {});
      }
    } catch (error) {
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function searchBooks(bookName) {
    if (bookName.length > 0) {
      try {
        console.log(bookName);
        const results = await fetchBooks(bookName);
        bookSearchResults = results;
        showDropdown = true;
      } catch (error) {
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
    console.log("selectBook:", book);
    try {
      if (book && !isBookSelected(book)) {
        const bookReference = {
          thumbnail: book.thumbnail,
          title: book.title,
          authors: Array.isArray(book.authors)
            ? book.authors.join(", ")
            : "Unknown author(s)",
          publishedDate: book.publishedDate,
        };
        console.log(bookReference);
        if (Array.isArray(selectedBooks)) {
          selectedBooks = [...selectedBooks, bookReference];
          litRefDispatch("updateLitRefs", selectedBooks);
          bookSearchResults = [];
          searchBookName = "";
        }
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occured: ${error.message}`, {
        initialError: error,
      });
    }
  }

  function isBookSelected(bookToCheck) {
    return selectedBooks.some(
      (book) =>
        book.title === bookToCheck.title &&
        book.publishedDate === bookToCheck.publishedDate &&
        book.thumbnail === bookToCheck.thumbnail
    );
  }

  function removeBook(bookIndex) {
    selectedBooks = selectedBooks.filter((_, i) => i !== bookIndex);
    litRefDispatch("updateLitRefs", selectedBooks);
  }

  function openRemoveBookModal(bookIndex) {
    currentBookIndex = bookIndex;
    showRemoveBookModal = true;
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
      bind:value={searchBookName}
    />
    {#if bookSearchResults.length > 0}
      <Dropdown class="dropdown" size="md" bind:open={showDropdown}>
        {#each bookSearchResults as book}
          <DropdownItem
            class="dropdown-item"
            disabled={isBookSelected(book)}
            on:click={() => selectBook(book)}
          >
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
      {#each selectedBooks as book, bookIndex}
        <div class="ref-item">
          <div class="ref-cover-display">
            <img
              class="ref-cover-image"
              src={book.thumbnail}
              alt={book.title}
            />
          </div>
          <!-- DETAILS on HOVER -->
          <div class="ref-details">
            <p>{book.title}</p>
            <p>
              ({Array.isArray(book.authors)
                ? book.authors.join(", ")
                : "Unknown author(s)"},
            </p>
            <p>{book.publishedDate})</p>
          </div>
          <button
            class="remove-ref-button"
            on:click={() => openRemoveBookModal(bookIndex)}
            >X
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <Modal bind:open={showRemoveBookModal} size="xs" autoclose>
    <div class="remove-ref-modal-container">
      <ExclamationCircleOutline size="xl" class="modal-exclamation-icon" />
      <h3 class="modal-text">
        Are you sure you want to remove this literature reference?
      </h3>
      <Button
        color="red"
        class="me-2"
        on:click={() => removeBook(currentBookIndex)}>Yes, I'm sure</Button
      >
      <Button color="alternative" on:click={() => (showRemoveBookModal = false)}
        >No, cancel</Button
      >
    </div>
  </Modal>
</div>
