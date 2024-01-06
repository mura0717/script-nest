<script>
  import { Search, Label, Dropdown, DropdownItem } from "flowbite-svelte";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import "./references.css";
  import "../../../pages/Idea/idea.css";
  import { handleError } from "../../../utils/ErrorHandling/GlobalErrorHandlerClient";

  const currentIdeaId = "";
  let bookSearchResults = [];
  let selectedBook;
  let searchTimeout;
  let showDropdown = false;

  async function searchBooks(searchQuery) {
    try {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        if (searchQuery.length > 0) {
          let googleBookApiResponse = await getRequest(
            `/api/ideas/books?q=${encodeURIComponent(searchQuery)}`
          );
          if (googleBookApiResponse && googleBookApiResponse.bookId && googleBookApiResponse.bookId.items) {
            bookSearchResults = googleBookApiResponse.bookId.items.slice(0, 5).map((item) => ({
              thumbnail: item.volumeInfo.imageLinks.smallThumbnail,
              title: item.volumeInfo.title, 
            }));
            showDropdown = true;
          } else {
            throw new AppError(`Error - Expected data is not present: ${error.message}`, {
              initialError: error,
            });
          }
        } else {
          bookSearchResults = [];
        }
      }, 500);
      console.log("LitRef-Updated books after search:", bookSearchResults);
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occurred: ${error.message}`, {
        initialError: error,
      });
    }
  }

  async function selectBook(book) {
    selectedBook = book;
    const bookReference = {
      coverImageUrl: book.volumeInfo.imageLinks.thumbnail.small,
      title: book.volumeInfo.title,
      publicationDatae: book.volumeInfo.publishedDate,
      authors: book.volumeInfo.authors,
    };

    await postRequest(`/api/ideas/${currentIdeaId}/books`, bookReference);
  }
</script>

<div>
  <Label class="idea-element-label" for="literature-references-input"
    >Literature References:</Label
  >
  <form class="flex gap-2">
    <Search size="md" on:input={(event) => searchBooks(event.target.value)} />
    {#if bookSearchResults.length > 0}
      <Dropdown class="min-w-full" size="md" bind:open={showDropdown}>
        {#each bookSearchResults as book}
          <DropdownItem class="flex items-center"
            on:click={() => selectBook(book)}
          >
            <img class="book-thumbnail" src={book.thumbnail} alt={book.title} /> 
            {book.title} <!-- Because response is mapped like this => title: item.volumeInfo.title  -->
          </DropdownItem>
        {/each}
        </Dropdown>
    {/if}
  </form>

  {#if selectedBook}
    <div class="book-display">
      <img
        src={selectedBook.volumeInfo.imageLinks.thumbnail}
        alt={selectedBook.volumeInfo.title}
      />
      <!-- Hidden details to show on hover -->
      <div class="book-details">
        <p>{selectedBook.volumeInfo.title}</p>
        <p>{selectedBook.volumeInfo.publishedDate}</p>
        <p>{selectedBook.volumeInfo.authors.join(", ")}</p>
      </div>
    </div>
  {/if}
</div>
