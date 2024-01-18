<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    Button,
  } from "flowbite-svelte";
  import "./notifications.css";
  import io from "socket.io-client";
  import { userStore } from "../../store/userStore.js";
  import { notificationsStore } from "../../store/notificationsStore.js";
  import { addUserAsCollaborator } from "../../store/collaboratorStore.js";

  const socket = io("localhost:8080");

  let userId = "";

  $: if ($userStore.user) {
    userId = $userStore.user.uid;
    console.log("Notifications/User ID:", userId);
    socket.emit("user-connect", {
      userId,
    });
  } else {
    console.log("Notifications/User not loaded yet");
  }

  socket.on("invite-collaborator", (data) => {
    console.log("Notifications/socket-on: invite-collaborator data:", data);
    notificationsStore.update((store) => {
      return {
        notifications: [...store.notifications, data],
        hasUnread: true,
      };
    });
  });

  socket.on("accept-invite", (data) => {
    notificationsStore.update((store) => {
      return {
        notifications: [...store.notifications, data],
        hasUnread: true,
      };
    });
  });

  socket.on("decline-invite", (data) => {
    notificationsStore.update((store) => {
      return {
        notifications: [...store.notifications, data],
        hasUnread: true,
      };
    });
  });

  $: console.log("Updated notifications:", $notificationsStore.notifications);

  function acceptInvitation(notification) {
    console.log("respongingUserName from target:", notification.targetUserName);
    const currentUser = $userStore.user;
    console.log("Current User:", currentUser.displayName);
    const notificationData = {
      notificationId: notification.notificationId,
      invitationId: notification.invitationId,
      respondingUserId: notification.targetUserId,
      respondingUserName: notification.targetUserName || currentUser || "",
      targetUserId: notification.respondingUserId,
      targetUserName: notification.respondingUserName,
      ideaTitle: notification.ideaTitle,
      ideaId: notification.ideaId,
      accepted: true,
    };
    console.log("Accepting with notification:", notification);
    console.log("Accepting with notificationData:", notificationData);
    addUserAsCollaborator(notificationData);
    socket.emit("invite-accepted", { notificationData });
  }

  function declineInvitation(notification) {
    const currentUser = $userStore.user;
    const notificationData = {
      notificationId: notification.notificationId,
      invitationId: notification.invitationId,
      respondingUserId: notification.targetUserId,
      respondingUserName: currentUser.displayName,
      targetUserId: notification.inviterInfo.uid,
      ideaTitle: notification.ideaTitle,
      ideaId: notification.ideaId,
      accepted: false,
    };
    console.log("Declining with notification:", notification);
    console.log("Declining with notificationData:", notificationData);
    socket.emit("invite-declined", { notificationData });
  }
</script>

<div>
  <Dropdown triggeredBy="#bell" size="sm" class="dropdown">
    <div slot="header" class="text-center py-2 font-bold w-[300px]">
      Notifications
    </div>
    {#if $notificationsStore.notifications.length === 0}
      <DropdownItem class="flex space-x-4">Nothing yet</DropdownItem>
    {/if}
    {#each $notificationsStore.notifications as notification}
      <DropdownItem class="flex space-x-4">
        <div class="notification-message">{notification.message}</div>
        {#if notification.type === "collaborator-invite"}
          <Button size="xs" on:click={() => acceptInvitation(notification)}
            >Accept</Button
          >
          <Button
            size="xs"
            color="alternative"
            on:click={() => declineInvitation(notification)}>Decline</Button
          >
        {/if}
        <DropdownDivider />
      </DropdownItem>
    {/each}
  </Dropdown>
</div>
