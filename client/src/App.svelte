<script>

  import { Router, Link, Route } from "svelte-navigator";
  import NavBar from "./components/NavBar/NavBar.svelte";
  import Index from "./pages/Index/Index.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Login from "./pages/Login/Login.svelte";

  import PrivateRoute from './components/PrivateRoutes/PrivateRoute.svelte';
  import UserProfile from "./pages/UserProfile/UserProfile.svelte";
  import IdeaForm from './pages/Idea/IdeaForm.svelte';
  import Contact from "./pages/Contact/Contact.svelte";
</script>

<Router>
   <!-- NavBar comes in here.  -->
  <NavBar/>

  <div>
    <!-- Public Routes -->
    <Route path="/" component={Index}></Route>
    <Route path="/auth/signup" component={Signup}></Route>
    <Route path="/auth/login" component={Login}></Route>
    <Route path="/auth/ideaform" component={IdeaForm}></Route>
    <Route path="/auth/contact" component={Contact}></Route>

    <!-- Private Routes -->
    <PrivateRoute path="/auth/user/profile" let:location>
      <UserProfile></UserProfile>
    </PrivateRoute>

    
  </div>

</Router>
