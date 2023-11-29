<script>
  import "../../styles/global.css";
  import { onMount } from "svelte";
  import { userStore } from "./../../store/userStore.js";
  import toast, { Toaster } from "svelte-french-toast";

  let userName = '';
  
  onMount(() => {
    userName = $userStore.user;
  });

</script>

<div class="page-title">
  <h1>Welcome " {userName} "</h1>
</div>
