<script>
  import { Search, Label } from "flowbite-svelte";
  import { getRequest, postRequest } from "../../../store/fetchStore";
  import "./references.css";
  import "../../../pages/Idea/idea.css";

  const currentIdeaId = "";
  let books = [];
  let selectedBook;

  async function searchBooks(query) {
    books = await getRequest(`/api/ideas/books?q=${encodeURIComponent(query)}`);
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
  <Label class="idea-element-label"for="literature-references-input">Literature References:</Label>
  <form class="flex gap-2">
    <Search size="md" on:input={(event) => searchBooks(event.target.value)} />
    {#if books.length > 0}
      <div class="dropdown">
        {#each books as book}
          <div class="dropdown-item" on:click={() => selectBook(book)}>
            {book.volumeInfo.title}
          </div>
        {/each}
      </div>
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
