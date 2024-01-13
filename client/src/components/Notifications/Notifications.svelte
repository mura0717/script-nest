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
    Modal,
    Button,
  } from "flowbite-svelte";
  import "./notifications.css";

  let showInvitationModal = false;
  let invitationId;

  function handleInvitationModal() {
    showInvitationModal = true;
  }

  function acceptInvitation(invitationId) {}

  function declineInvitation(invitationId){}

  function handleCommentNotification(commentId) {
    //redirect to the idea page with the comment
  }
</script>

<div>
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

<!--   <Modal bind:open={showInvitationModal} size="xs" autoclose>
    <div class="remove-ref-modal-container">
      <h3 class="modal-text">Do you accept the invitation?</h3>
      <Button class="me-2" on:click={() => acceptInvitation(invitationId)}
        >Accept</Button
      >
      <Button color="alternative" on:click={() => (showInvitationModal = false)}
        >Decline</Button
      >
    </div>
  </Modal> -->
</div>
