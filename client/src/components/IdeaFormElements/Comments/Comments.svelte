<script>
  import { Label, Textarea, Button } from "flowbite-svelte";
  import "./comments.css";
  import "../../../pages/Idea/idea.css";
  import "../../../styles/global.css";
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore } from "../../../store/userStore.js";
  export let comments = [];
  let displayedComments = [];
  let comment = '';
  let assignedName = "";
  const commentDispatch = createEventDispatcher();

   $: if (Array.isArray(comments)) {
    displayedComments = [...comments];
  }

  function assignCommentatorName(){
    assignedName = $userStore.user.displayName;
    return assignedName;
  } 

  function addComment(){
    let name = assignCommentatorName();
    const newComment = {
      commentatorName: name || "Anonymous",
      commentText: comment,
      commentDate: new Date().toLocaleString().slice(0, 17),
    };
    displayedComments = [newComment, ...displayedComments];
    commentDispatch("updateComments", displayedComments); //("event name", payload)
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
    {#each displayedComments as comment}
      <div class="comment-display">
        <p class="comment-info">{comment.commentatorName} - {comment.commentDate}</p>
        <p>{comment.commentText}</p>
      </div>
    {/each}
  </div>
</div>
