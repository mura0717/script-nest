<script>
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
    <NavUl>
      <NavLi class="navbar-elements-style" href="/auth/sockettest"
        >SocketTest</NavLi
      >
      <NavLi class="navbar-elements-style" href="/auth/login">Login</NavLi>
      <NavLi class="navbar-elements-style" href="/auth/signup">Signup</NavLi>
      <NavLi class="navbar-elements-style" href="/auth/contact">Contact</NavLi>
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
    </NavUl>
  </Navbar>
</div>
