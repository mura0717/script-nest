<script>
  import "./login.css";
  import { Button } from 'flowbite-svelte';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../../config/firebaseClientConfig.js';
  import { postRequest } from "../../store/fetchStore.js";
  import { navigate } from "svelte-navigator";
  import toast, { Toaster } from "svelte-french-toast";

  let email = "";
  let password = "";

  function inputCheck() {
    if ( !email || !password) {
      toast.error("No empty fields.");
      return false;
    }
    return true;
  }

  async function handleLogin() {
    console.log("handleLogin is hit.")
    if(!inputCheck()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const response = await postRequest("/api/auth/login", { idToken });
      if (response.success) {
        console.log("idToken:", idToken);
        toast.success("Login successful!");
        navigate("/auth/user/profile", {replace: true});
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(error.message || "An error occurred during login.");
    }
  }
</script>

  <main>
    <div class="page-title">
      <h1>Login</h1>
    </div>
    <div class="login-container">
      <div>
        <div>
          <label for="email-input">Email:</label>
        </div>
        <input
          class="input-field"
          type="email"
          id="email-input"
          placeholder="Email"
          bind:value={email}
        />
      </div>

      <div>
        <div>
          <label for="password-input">Password:</label>
        </div>

        <input
          class="input-field"
          type="password"
          id="password-input"
          placeholder="Password"
          bind:value={password}
        />
      </div>
      <div class="submit-button-container">
        <Button on:click={handleLogin}>Submit</Button>
      </div>
    </div>
  </main>
