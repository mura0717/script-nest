import { db } from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

export const commentServices = {

    addComment: async (ideaId, commentData) => {
    const commentsRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("comments");
    await commentsRef.add(commentData);
  },

  getComments: async (ideaId, limit = 20) => {
    const commentsRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .limit(limit);
    const snapshot = await commentsRef.get();
    let comments = [];
    snapshot.forEach((doc) => comments.push({ id: doc.id, ...doc.data() }));
    return comments;
  },

  editComment: async (ideaId, commentDocId, updatedCommentData) => {
    const commentDocRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("comments")
      .doc(commentDocId);
    await commentDocRef.update(updatedCommentData);
    return commentDocId; 
  },

  deleteComment: async (ideaId, commentDocId) => {
    const commentDocRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("comments")
      .doc(commentDocId);
    await commentDocRef.delete();
    return commentDocId;
  },
};

export default commentServices;