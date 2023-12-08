<script>
  import "./getInspired.css";
  import { Button } from 'flowbite-svelte';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../../config/firebaseClientConfig.js';
  import { postRequest } from "../../store/fetchStore.js";
  import { navigate } from "svelte-navigator";
  import { userStore } from "../../store/userStore.js";
  import { updateLoginStatus } from "../../store/loginStatus.js";
  import toast, { Toaster } from "svelte-french-toast";
  import { Toast } from 'flowbite-svelte';

let title = "";
  let genre = "";

  function handlePlotGenerator() {
  }
</script>


<main>
    <div class="page-title">
      <h1>Plot Generator</h1>
    </div>
    <div class="login-container">
      <div>
        <div>
          <label for="title-input">Title:</label>
        </div>
        <input
          class="input-field"
          type="text"
          id="title-input"
          placeholder="Title"
          bind:value={title}
        />
      </div>

      <div>
        <div>
          <label for="name-input">Genre:</label>
        </div>

        <input
          class="input-field"
          type="text"
          id="genre-input"
          placeholder="Genre"
          bind:value={genre}
        />
      </div>
      <div class="submit-button-container">
        <Button on:click={handlePlotGenerator}>Generate</Button>
      </div>
    </div>
</main>