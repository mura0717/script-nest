/* import {
  doc,
  addDoc,
  updateDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { admin } from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";

const uri = "https://www.googleapis.com/books/v1/volumes";
const db = getFirestore();

export const booksServices = {
  saveBookReference: async (bookId) => {
    const ideaRef = db
      .collection("users")
      .doc(userId)
      .collection("ideas")
      .doc(ideaId);
    await ideaRef.update({
      literatureReferences:
        firebase.firestore.FieldValue.arrayUnion(bookReference),
    });
  },
}; */