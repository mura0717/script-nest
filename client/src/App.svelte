<script>

  import { Router, Link, Route } from "svelte-navigator";
  import NavBar from "./components/NavBar/NavBar.svelte";
  import Home from "./pages/Home/Index.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Login from "./pages/Login/Login.svelte";
  import UserProfile from "./pages/User/User.svelte";
  import IdeaForm from './pages/Idea/IdeaForm.svelte';
  import Contact from "./pages/Contact/Contact.svelte";
</script>

<Router>
  <NavBar/> <!-- NavBar comes in here.  -->

  <div>
    <!-- Public Routes -->
    <Route path="/" component={Home}></Route>
    <Route path="/auth/signup" component={Signup}></Route>
    <Route path="/auth/login" component={Login}></Route>
    <Route path="/auth/user" component={UserProfile}></Route>
    <Route path="/auth/ideaform" component={IdeaForm}></Route>
    <Route path="/auth/contact" component={Contact}></Route>
  </div>

</Router>
