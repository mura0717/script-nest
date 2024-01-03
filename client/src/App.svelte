<script>
  import { initializeApp } from "firebase/app";
  import { Router, Link, Route } from "svelte-navigator";
  import { Toaster } from "svelte-french-toast";
  import "./styles/tailwind-components.css";
  import "./styles/global.css";

  import NavBar from "./components/NavBar/NavBar.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import Index from "./pages/Index/Index.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Login from "./pages/Login/Login.svelte";

  import PrivateRoute from "./components/PrivateRoutes/PrivateRoute.svelte";
  import UserProfile from "./pages/UserProfile/UserProfile.svelte";
  import SideBar from "./components/SideBar/SideBar.svelte";
  import Idea from "./pages/Idea/Idea.svelte";
  import Contact from "./pages/Contact/Contact.svelte";
  import AdminProfile from "./pages/AdminProfile/AdminProfile.svelte";
  import { DarkMode } from "flowbite-svelte";
  import PrivateRouteGuard from "./components/PrivateRoutes/PrivateRouteGuard.svelte";
</script>

<!-- <DarkMode /> -->
<Toaster />

<Router>
  <div id="app">
    <NavBar />
    <aside class="sidebar-container">
      <SideBar />
    </aside>

    <main class="main-content">
      <!-- Public Routes -->
      <Route path="/" component={Index}></Route>
      <Route path="/auth/signup" component={Signup}></Route>
      <Route path="/auth/login" component={Login}></Route>
      <Route path="/auth/contact" component={Contact}></Route>

      <!-- Private Routes -->
      <PrivateRoute path="/auth/user/profile" let:location>
        <UserProfile></UserProfile>
      </PrivateRoute>
      <PrivateRoute path="/auth/user/newidea" let:location>
        <Idea></Idea>
      </PrivateRoute>
      <PrivateRoute path="/auth/admin/profile" let:location>
        <AdminProfile></AdminProfile>
      </PrivateRoute>
    </main>

    <Footer />
  </div>
</Router>
