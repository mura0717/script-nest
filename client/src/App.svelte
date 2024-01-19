<script>
  import "./styles/global.css";
  import { Router, Route } from "svelte-navigator";
  import { Toaster } from "svelte-french-toast";

  import NavBar from "./components/NavBar/NavBar.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import Index from "./pages/Index/Index.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Login from "./pages/Login/Login.svelte";

  import PrivateRoute from "./components/PrivateRoutes/PrivateRoute.svelte";
  import UserProfile from "./pages/UserProfile/UserProfile.svelte";
  import SideBar from "./components/SideBar/SideBar.svelte";
  import Idea from "./pages/Idea/Idea.svelte";
  import SharedWithMe from "./pages/SharedWithMe/SharedWithMe.svelte";
  import Settings from "./pages/Settings/Settings.svelte";
  import Contact from "./pages/Contact/Contact.svelte";
  import AdminProfile from "./pages/AdminProfile/AdminProfile.svelte";
  import { userStore } from "./store/userStore";
</script>

<Toaster />

<Router>
  <div id="app">
    <NavBar />
    <div class="page-layout-container">
      {#if $userStore.showSidebar}
        <aside class="sidebar-layout-container">
          <SideBar />
        </aside>
      {/if}

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
        <PrivateRoute path="/auth/user/ideas/:ideaId" let:location>
          <Idea></Idea>
        </PrivateRoute>
        <PrivateRoute path="/auth/user/sharedwithme" let:location>
          <SharedWithMe></SharedWithMe>
        </PrivateRoute>
         <PrivateRoute path="/auth/user/settings" let:location>
          <Settings></Settings>
        </PrivateRoute>
        <PrivateRoute path="/auth/admin/profile" let:location>
          <AdminProfile></AdminProfile>
        </PrivateRoute>
      </main>
    </div>
    <Footer />
  </div>
</Router>
