<script>
  import { Label, Textarea, Button } from "flowbite-svelte";
  import "./comments.css";
  import "../../../pages/Idea/idea.css";
  import "../../../styles/global.css";
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore } from "../../../store/userStore.js";

  let comments = [];
  let commentText = '';
  let ideaOwnerName = $userStore.user.displayName;
  let ownerId = $userStore.user.uid;
  let commentatorName = "";
  const commentDispatch = createEventDispatcher();

  function assignCommentatorName(ideaData, collabId){
    
    if(ideaData.owner.uid === collabId){
      commentatorName = ideaOwnerName;
    } else {
      const collaborator = ideaData.collaborators.find(collab => collab.uid === collabId);
      commentatorName = collaborator ? collaborator.displayName : 'Unknown User';
    }
    
    return commentatorName;
  } 

  function addComment(){
    let commentatorName = assignCommentatorName();
    const newComment = {
      name: commentatorName || "Anonymous",
      comment: commentText,
      date: new Date().toLocaleString(),
    };
    comments = [newComment, ...comments];
    commentDispatch("updateComments", comments); //("event name", payload) to be send to the parent.
    commentText = '';
  }

</script>

<div>
  <Label for="comment-text-input" class="idea-element-label">Comment:</Label>
  <Textarea id="comment-text-input" bind:value={commentText} rows={4} cols={50} placeholder="Add your comment..." />
  <div class="submit-button-container">
    <Button on:click={() => addComment(commentText)}>Add Comment</Button>
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
