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
  import { BellSolid } from "flowbite-svelte-icons";
  import "./navbar.css";
  import scriptnestLogo from "../../assets/logos/scriptnest_logo.png";
  import Notifications from "../Notifications/Notifications.svelte";
</script>

<div class="navbar-container">
  <Navbar class="bg-orange-100">
    <NavBrand href="/">
      <img
        src={scriptnestLogo}
        class="mr-3 h-6 sm:h-12"
        alt="ScriptNest_Logo"
      />
    </NavBrand>
    <NavHamburger />
    <NavUl>
      <NavLi class="navbar-elements-style" href="/auth/sockettest">SocketTest</NavLi>
      <NavLi class="navbar-elements-style" href="/auth/login">Login</NavLi>
      <NavLi class="navbar-elements-style" href="/auth/signup">Signup</NavLi>
      <NavLi class="navbar-elements-style" href="/auth/contact">Contact</NavLi>
      <div id="bell" class="notification-bell">
        <BellSolid class="notification-bell-solid" />
        <div class="flex relative">
          <div class="notification-alert-dot dark:border-gray-90" />
        </div>
      </div>
      <div>
        <Notifications />
      </div>
    </NavUl>
  </Navbar>
</div>
