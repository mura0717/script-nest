<script>
  import "./login.css";
  import "../../styles/global.css";
  import { Input, Label, Button } from "flowbite-svelte";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../../config/firebaseClientConfig.js";
  import { postRequest } from "../../store/fetchStore.js";
  import { navigate } from "svelte-navigator";
  import { toast } from "svelte-french-toast";
  import { userStore } from "../../store/userStore.js";

  let email = "";
  let password = "";
  let isAdmin = false;

  $: if ($userStore.user && $userStore.user.isAdmin) {
    isAdmin = $userStore.user.isAdmin;
  }

  function inputCheck() {
    if (!email || !password) {
      toast.error("No empty fields.");
      return false;
    }
    return true;
  }

  async function handleLogin() {
    if (!inputCheck()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      const response = await postRequest("/api/auth/login", { idToken });
      if (response.success) {
        toast.success("Login successful!");
        if (!isAdmin) {
          navigate("/auth/user/profile", { replace: true });
        } else {
          navigate("/auth/admin/profile", { replace: true });
        }
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
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
        <Label for="email-input" class="login-label">Email:</Label>
      </div>
      <Input
        class="input-field"
        type="email"
        id="email-input"
        placeholder="Email"
        size="md"
        bind:value={email}
      />
    </div>

    <div>
      <div>
        <Label for="password-input" class="login-label">Password:</Label>
      </div>

      <Input
        class="input-field"
        type="password"
        id="password-input"
        placeholder="Password"
        size="md"
        bind:value={password}
      />
    </div>
    <div class="submit-button-container">
      <Button on:click={handleLogin}>Submit</Button>
    </div>
  </div>
</main>
