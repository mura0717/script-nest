import { Router } from "express";
const router = Router();
import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { booksServices } from "../services/apiServices.js";

router.get(
  "/api/ideas/books",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_BOOKS_API}`
    );
    const bookId = await response.json;
    //await apiServices.saveBookReference(bookId);
    res.status(200).send({ bookId, message: "Books fetch successful." });
  })
);

router.post("/api/ideas/:ideaId/books", isAuthenticated, catchAsync(async (req, res) => {
    const userId = req.user.id; // Assume you have the user's ID from authentication
    const ideaId = req.params.ideaId;
    const bookReference = req.body; // Book reference data sent from the client

    await saveBookReference(userId, ideaId, bookReference);
    res.status(200).json({ message: "Book reference saved successfully" });
  })
);

export default router;
