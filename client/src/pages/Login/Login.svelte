<script>
  import { postRequest } from "../../store/fetchStore.js";
  import { navigate } from "svelte-navigator";
  import { user } from "../../store/userStore.js";
  import { updateLoginStatus } from "../../store/loginStatus.js";
  import toast, { Toaster } from "svelte-french-toast";

  let email = "";
  let password = "";

  function handleLogin() {}
</script>

<h1>Login</h1>

<input type="email" id="email-input" placeholder="Email" bind:value={email} />
<input
  type="password"
  id="password-input"
  placeholder="Password"
  bind:value={password}
/>
<button on:click={handleLogin}>Submit</button>
