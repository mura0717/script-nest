<script>
    import "./NavBar.css";
    import toast, { Toaster } from "svelte-french-toast";
    import { userStore } from "../../store/userStore.js";
    import { getRequest } from '../../store/fetchStore.js';
  //import { isLoggedIn } from "../../store/loginStatus.js";
  import { navigate } from "svelte-navigator";

 
</script>

<nav class="navbar">
  <ul class="nav-items">
    <section class="nav-section left">
        <li><a href="/">Home</a></li>
    </section>
    <section class="nav-section right">
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/">Logout</a></li>
        <li><a href="/auth/signup">Signup</a></li>
        <li><a href="/auth/user">Profile</a></li>
        <li><a href="/auth/ideaform">IdeaForm</a></li>
        <li><a href="/auth/contact">Contact</a></li>
        <li>
        <a href="/auth/notifications">
            <span class="notification-icon">🔔</span>
        </a>
        </li>
    </section>
  </ul>
</nav>
