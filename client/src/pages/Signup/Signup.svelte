<script>
  import "./signup.css";
  import "../../styles/global.css";
  import { Button } from 'flowbite-svelte';
  import { postRequest } from "../../store/fetchStore.js";
  import { navigate } from "svelte-navigator";
  import { userStore } from "../../store/userStore.js";
  import toast, { Toaster } from "svelte-french-toast";

  let name = "";
  let email = "";
  let password = "";
  let rePassword = "";

  function inputCheck() {
    if (!name || !email || !password) {
      toast.error("No empty fields.");
      return false;
    }
    return true;
  }

  function passwordCheck() {
    if (password !== rePassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  }

  async function handleSignup() {
    console.log("handleSignup clicked.");
    if (!inputCheck()) return;
    if (!passwordCheck()) return;
    try {
      const response = await postRequest("/api/auth/signup", { name, email, password });
      if (response.success) {
        toast.success("Signup successful!");
        navigate("/auth/login");
      } else {
        toast.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.message || "An error occurred during registration.");
    }
  }
</script>

<Toaster />

  <main>
    <div class="page-title">
      <h1>Sign Up</h1>
    </div>

    <div class="signup-container">
      <div>
        <label for="name-input">Name:</label>
        <div>
          <input
            class="input-field"
            type="text"
            id="name-input"
            placeholder="Name"
            bind:value={name}
          />
        </div>
      </div>
      <div>
        <label for="email-input">Email:</label>
        <div>
          <input
            class="input-field"
            type="email"
            id="email-input"
            placeholder="Email"
            bind:value={email}
          />
        </div>
      </div>
      <div>
        <label for="password-input">Password:</label>
        <div>
          <input
            class="input-field"
            type="password"
            id="password-input"
            placeholder="Password"
            bind:value={password}
          />
        </div>
      </div>
      <div>
        <label for="rePassword-input">Re-Password:</label>
        <div>
          <input
            class="input-field"
            type="password"
            id="rePassword-input"
            placeholder="Re-Password"
            bind:value={rePassword}
          />
        </div>
      </div>
      <div class="submit-button-container">
        <Button type="submit" on:click={handleSignup}>Register</Button>
      </div>
    </div>
  </main>
