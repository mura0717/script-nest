import { Router } from "express";
const router = Router();

import AppError from "../utils/errorHandling/AppError.js";
import { catchAsync } from "../utils/errorHandling/errorHandlers.js";
import ideaServices from "../services/ideaServices.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

//GET ALL IDEAS
router.get('/api/ideas', catchAsync(async (req, res) => {
    const userId = req.user.uid; // User's UID
    // Add code to fetch ideas from Firestore for the given userId
    // Return ideas in response
}));

//G
router.post('/api/ideas/create', catchAsync(async (req, res) => {
    const userId = req.user.uid;
    const ideaData = req.body;
    // Add code to save ideaData to Firestore under the userId
    // Return success response
}))

router.patch('/api/ideas', catchAsync(async (req, res) => {
    const userId = req.user.uid; // User's UID
    // Add code to edit ideas from Firestore for the given userId
    // Return success response
}));

router.get('/api/ideas/books', isAuthenticated, catchAsync(async (req, res) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_BOOKS_API}`
    );
    const bookId = await response.json;
    await ideaServices.saveBookReference(bookId);
    res
      .status(200)
      .send({ bookId });

}))

export default router;