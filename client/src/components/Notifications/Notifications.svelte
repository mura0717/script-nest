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

  let userId = "";
  $: if ($userStore.user) {
    userId = $userStore.user.uid;
    console.log("Notifications/User ID:", userId);
  } else {
    console.log("Notifications/User not loaded yet");
  }

  const socket = io("localhost:3000");

  //SERVER - USER TEST CONNECTION
  /*   socket.on("connect", () => {
    console.log("Socket connection established on client with ID:", socket.id);
    socket.emit("register-user", { userId });
  }); */

  //SERVER - USER TEST DISCONNECTION
  /*   socket.on("disconnect", () => {
    console.log("Socket disconnected on client.");
  }); */

  let dropdownOpen = false;

  let notifications = $notificationsStore.notifications;
  $: console.log("Updated notifications:", $notificationsStore.notifications);

  socket.on("server-send-a-notification", (notificationData) => {
    console.log("Received notification:", notificationData);
    if (notificationData.targetUserId === userId) {
      // notifications = [...notifications, newNotification];
      notificationsStore.update((store) => {
        return {
          notifications: [...store.notifications, notificationData],
          hasUnread: true,
        };
      });
      if (notificationData.type === "invitation-accepted") {
        console.log("notification type:", notificationData.type);
        addUserAsCollaborator(notificationData);
      } else {
        console.log("Unhandled notification type:", notificationData.type);
      }
    } else {
      console.log("Notification not for the current user.");
    }
  });

  function acceptInvitation(
    invitationId,
    respondingUserId,
    respondingUserName,
    respondingUserPhotoUrl,
    targetUserId,
    ideaTitle,
    ideaId
  ) {
    const notificationData = {
      invitationId,
      respondingUserId,
      respondingUserName,
      respondingUserPhotoUrl,
      targetUserId,
      ideaTitle,
      ideaId,
      accepted: true,
    };
    socket.emit("client-send-invitation-response", { notificationData });
    dropdownOpen = false;
  }

  function declineInvitation(
    invitationId,
    respondingUserId,
    respondingUserName,
    respondingUserPhotoUrl,
    targetUserId,
    ideaTitle,
    ideaId
  ) {
    const notificationData = {
      invitationId,
      respondingUserId,
      respondingUserName,
      respondingUserPhotoUrl,
      targetUserId,
      ideaTitle,
      ideaId,
      accepted: false,
    };
    console.log("declineInvitation/inviterId:", inviterId);
    socket.emit("client-send-invitation-response", { notificationData });
    dropdownOpen = false;
  }

  function handleCommentNotification(commentId) {
    //redirect to the idea page with the comment
  }
</script>

<div>
  <Dropdown triggeredBy="#bell" size="sm" class="dropdown">
    <div slot="header" class="text-center py-2 font-bold">Notifications</div>
    {#each notifications as notification}
      <DropdownItem class="flex space-x-4">
        <div class="notification-message">{notification.message}</div>
        {#if notification.type === "collaborator-invite"}
          <Button
            size="xs"
            on:click={() =>
              acceptInvitation(
                notification.invitationId,
                notification.targetUserId,
                notification.targetUserName,
                notification.targetUserPhotoUrl,
                notification.inviterInfo.uid,
                notification.ideaTitle,
                notification.ideaId
              )}>Accept</Button
          >
          <Button
            size="xs"
            color="alternative"
            on:click={() =>
              declineInvitation(
                notification.targetUserName,
                notification.targetUserPhotoUrl,
                notification.ideaTitle
              )}>Decline</Button
          >
        {/if}
        <DropdownDivider />
      </DropdownItem>
      {#if notifications.length === 0}
        <DropdownItem class="flex space-x-4">Nothing yet</DropdownItem>
      {/if}
    {/each}
  </Dropdown>
</div>

<!-- <div>
  <Dropdown
    triggeredBy="#bell"
    size="sm"
    class="w-full max-w-sm rounded divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700"
  >
    <div slot="header" class="text-center py-2 font-bold">Notifications</div>
    <DropdownItem class="flex space-x-4" on:click={handleInvitationModal}>
      <div class="pl-3 w-full">
        <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-white"
            >Jese Leos</span
          >
          has invited you to:<span
            class="font-semibold text-gray-900 dark:text-white"
            >Space Wars
          </span>
        </div>
        <div class="text-xs text-primary-600 dark:text-primary-500">
          a few moments ago
        </div>
      </div>
      <Button size="xs" on:click={acceptInvitation}>Accept</Button>
      <Button size="xs" color="alternative" on:click={declineInvitation}>Decline</Button>
    </DropdownItem>
    <DropdownDivider />
    <DropdownItem class="flex space-x-4">
      <div class="pl-3 w-full">
        <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          New comment from <span
            class="font-semibold text-gray-900 dark:text-white"
            >Joseph Mcfall</span
          >
          : "Premise is good."
        </div>
        <div class="text-xs text-primary-600 dark:text-primary-500">
          10 minutes ago
        </div>
      </div>
      <Button size="xs">View</Button>
    </DropdownItem>
  </Dropdown>
</div>
 -->
