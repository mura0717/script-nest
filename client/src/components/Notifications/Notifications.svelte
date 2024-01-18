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
    socket.emit("user-connect", {
      userId,
    });
  } else {
  }

  socket.on("invite-collaborator", (data) => {
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

  function acceptInvitation(notification) {
    const currentUser = $userStore.user;
    const notificationData = {
      notificationId: notification.notificationId,
      invitationId: notification.invitationId,
      respondingUserId: notification.targetUserId,
      respondingUserName: currentUser,
      targetUserId: notification.respondingUserId,
      targetUserName: notification.respondingUserName,
      ideaTitle: notification.ideaTitle,
      ideaId: notification.ideaId,
      accepted: true,
    };
    addUserAsCollaborator(notificationData);
    socket.emit("invite-accepted", { notificationData });
  }

  function declineInvitation(notification) {
    const currentUser = $userStore.user;
    const notificationData = {
      notificationId: notification.notificationId,
      invitationId: notification.invitationId,
      respondingUserId: notification.targetUserId,
      respondingUserName: currentUser,
      targetUserId: notification.respondingUserId,
      targetUserName: notification.respondingUserName,
      ideaTitle: notification.ideaTitle,
      ideaId: notification.ideaId,
      accepted: false,
    };
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
