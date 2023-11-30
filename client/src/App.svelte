<script>
  import { Router, Link, Route } from "svelte-navigator";
  import "./styles/tailwind-components.css";
  import "./styles/global.css";

  import NavBar from "./components/NavBar/NavBar.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import Index from "./pages/Index/Index.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Login from "./pages/Login/Login.svelte";

  import PrivateRoute from "./components/PrivateRoutes/PrivateRoute.svelte";
  import UserProfile from "./pages/UserProfile/UserProfile.svelte";
  import IdeaForm from "./pages/Idea/IdeaForm.svelte";
  import Contact from "./pages/Contact/Contact.svelte";
</script>

<Router>
  <div id="app">
    <NavBar />

  <main class="main-content">
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
  </main>

  <Footer />
  </div>
  
</Router>
