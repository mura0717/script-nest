<script>
  import Signup from "./../../pages/Signup/Signup.svelte";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from "flowbite-svelte";
  import { BellSolid } from "flowbite-svelte-icons";
  import "./navbar.css";
  import scriptnestLogo from "../../assets/logos/scriptnest_logo.png";
  import Notifications from "../Notifications/Notifications.svelte";
  import { notificationsStore } from "../../store/notificationsStore.js";
  import { userStore } from "../../store/userStore.js";

  $: loggedIn = $userStore.user !== null;

  $: hasUnreadNotifications = $notificationsStore.hasUnread;

  function resetNotificationIndicator() {
    hasUnreadNotifications = false;
  }
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
    <NavUl class="mr-16">
      {#if $userStore.showLogin}
        <NavLi class="navbar-elements-style" href="/auth/login">Login</NavLi>
      {/if}
      {#if $userStore.SignUp}
        <NavLi class="navbar-elements-style" href="/auth/signup">Signup</NavLi>
      {/if}
      <NavLi class="navbar-elements-style" href="/auth/contact">Contact</NavLi>
      {#if loggedIn}
        <NavLi
          ><div
            id="bell"
            class="notification-bell"
            on:click={resetNotificationIndicator}
            on:keydown={resetNotificationIndicator}
          >
            <BellSolid class="notification-bell-solid" />
            {#if hasUnreadNotifications}
              <div class="notification-alert-dot dark:border-gray-90"></div>
            {/if}
          </div>
          <div class="absolute">
            <Notifications class="notifications-dropdown" />
          </div>
        </NavLi>
      {/if}
    </NavUl>
  </Navbar>
</div>
