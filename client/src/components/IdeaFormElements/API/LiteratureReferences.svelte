<script>
import {Search, Form} from "flowbite-svelte";
import {getRequest} from "../../../store/fetchStore";

let books = [];
let selectedBook = '';

async function searchBooks(query) {
    const books = getRequest(`/api/ideas/books?q=${query}`);
    
}

function selectBooks(book) {
    selectedBook = book;

}

</script>

<div>
    <Form class="flex gap-2">
    <Search size="md" on:input={(e) => searchBooks(e.target.value)} />
  {#if books.length > 0}
    <div class="dropdown">
      {#each books as book}
        <div class="dropdown-item" on:click={() => selectBooks(book)}>
          {book.volumeInfo.title}
        </div>
      {/each}
    </div>
  {/if}
  </Form>

  {#if selectedBook}
  <div class="book-display" on:mouseenter={selectedBook.volumeInfo.title} on:mouseleave={selectedBook.volumeInfo.title}>
    <img src={selectedBook.volumeInfo.imageLinks.thumbnail} alt={selectedBook.volumeInfo.title} />
    <!-- Hidden details to show on hover -->
    <div class="book-details">
      <p>{selectedBook.volumeInfo.publishedDate}</p>
      <p>{selectedBook.volumeInfo.authors.join(', ')}</p>
    </div>
  </div>
{/if}

</div>