<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    DropdownDivider,
  } from "flowbite-svelte";
  import {
    ChevronDownOutline,
    BellSolid,
    EyeSolid,
  } from "flowbite-svelte-icons";
  import "./navbar.css";
  import scriptnestLogo from "../../assets/logos/scriptnest_logo.png";
  import { navigate } from "svelte-navigator";
  import { userStore } from "../../store/userStore.js";
  import { getRequest } from "../../store/fetchStore.js";
  import { Toast } from "flowbite-svelte";

  //import { isLoggedIn } from "../../store/loginStatus.js";


/*   async function handleLogout() {
    try {
      const response = await getRequest("/api/auth/logout");
    isLoggedIn.set(false);
    user.set(null);
    toast.success("Logout success.");
    navigate("/");

    } catch (error) {
      toast.error("Error logging out.");
      throw new Error(`HTTP error! Status: ${error}`);
  } */


</script>

<Navbar class="navbar-bg">
  <NavBrand href="/">
    <img src={scriptnestLogo} class="mr-3 h-6 sm:h-12" alt="ScriptNest Logo" />
  </NavBrand>
  <NavHamburger />
  <NavUl>
    <NavLi class="navbar-elements-style" href="/auth/login">Login</NavLi>
    <NavLi class="navbar-elements-style" href="/">Logout</NavLi>
    <NavLi class="navbar-elements-style" href="/auth/signup">Signup</NavLi>
    <NavLi class="navbar-elements-style" href="/auth/user/profile">Profile</NavLi>
    <NavLi class="navbar-elements-style" href="/auth/ideaform">IdeaForm</NavLi>
    <NavLi class="navbar-elements-style" href="/auth/get-inspired">Get Inspired</NavLi>
    <NavLi class="navbar-elements-style" href="/auth/contact">Contact</NavLi>
    <div
      id="bell"
      class="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
    >
      <BellSolid class="w-5 h-5kj" />
      <div class="flex relative">
        <div
          class="inline-flex relative -top-2 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
        />
      </div>
    </div>
    <Dropdown
      triggeredBy="#bell"
      class="w-full max-w-sm rounded divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700"
    >
      <div slot="header" class="text-center py-2 font-bold">Notifications</div>
      <DropdownItem class="flex space-x-4">
        <div class="pl-3 w-full">
          <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
            New message from <span
              class="font-semibold text-gray-900 dark:text-white"
              >Jese Leos</span
            >
            : "I didn't like the tagline."
          </div>
          <div class="text-xs text-primary-600 dark:text-primary-500">
            a few moments ago
          </div>
        </div></DropdownItem
      >
      <DropdownDivider />
      <DropdownItem class="flex space-x-4">
        <div class="pl-3 w-full">
          <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
            New message from <span
              class="font-semibold text-gray-900 dark:text-white"
              >Joseph Mcfall</span
            >
            : "Premise is good."
          </div>
          <div class="text-xs text-primary-600 dark:text-primary-500">
            10 minutes ago
          </div>
        </div>
      </DropdownItem>
    </Dropdown>
  </NavUl>
</Navbar>
