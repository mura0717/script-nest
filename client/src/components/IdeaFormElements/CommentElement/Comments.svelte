<script>
  import { Label, Textarea, Button } from "flowbite-svelte";
  import "./comments.css";
  import "../../../pages/Idea/idea.css";
  import "../../../styles/global.css";
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore } from "../../../store/userStore.js";

  let comments = [];
  let comment = '';
  let ideaOwnerName = $userStore.user.displayName;
  let ownerId = $userStore.user.uid;
  let assignedName = "";
  const commentDispatch = createEventDispatcher();

  function assignCommentatorName(ideaData, collabId){
    assignedName = $userStore.user.displayName;
    
   /*  if(ideaData.owner.uid === collabId){
      commentatorName = ideaOwnerName;
    } else {
      const collaborator = ideaData.collaborators.find(collab => collab.uid === collabId);
      commentatorName = collaborator ? collaborator.displayName : 'Unknown User';
    } */
    
    return assignedName;
  } 

  function addComment(){
    let name = assignCommentatorName();
    const newComment = {
      commentatorName: name || "Anonymous",
      commentText: comment,
      commentDate: new Date().toLocaleString().slice(0, 17),
    };
    comments = [newComment, ...comments];
    commentDispatch("updateComments", comments); //("event name", payload) to be send to the parent.
    comment = '';
  }

</script>

<div>
  <Label for="comment-text-input" class="idea-element-label">Comment:</Label>
  <Textarea id="comment-text-input" bind:value={comment} rows={4} cols={50} placeholder="Add your comment..." />
  <div class="submit-button-container">
    <Button on:click={() => addComment(comment)}>Add Comment</Button>
  </div>

  <div class="comments-list-container">
    {#each comments as comment}
      <div class="comment-display">
        <p class="comment-info">{comment.name} - {comment.date}</p>
        <p>{comment.comment}</p>
      </div>
    {/each}
  </div>
</div>
