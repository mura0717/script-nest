<script>
  import "../../styles/global.css";
  import { onMount } from "svelte";
  import { userStore } from "./../../store/userStore.js";
  import { getRequest } from "../../store/fetchStore.js";
  import toast, { Toaster } from "svelte-french-toast";

  let userName = "";
  let userIdeas = [];

  onMount(() => {
    userName = $userStore.user;
  });

  onMount(async () => {
    const { user } = $userStore.user;
    if (user) {
      const response = await getRequest("/api/ideas");
      if (response.ok) {
        userIdeas = await response.json();
      }
    }
  });
</script>
  
  <main>
    <div class="page-title">
      <h1>Welcome " {userName} "</h1>
    </div>
  </main>


