import { Router } from "express";
const router = Router();

import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync, handleError } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
// import { booksServices } from "../services/apiServices.js";

router.get(
  "/api/auth/books/search",
  isAuthenticated,
  catchAsync(async (req, res, next) => {
    console.log("apiRouters-getBook is hit.");
    const searchQuery = req.query.q;
    console.log("apiRouters-getBook searchQuery:", searchQuery);
    if (!searchQuery) {
      return next(new AppError("No search query provided.", 400));
    }
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchQuery
      )}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );
    console.log("apiRouter-apiGetRouterBook response:", response);
    const bookId = await response.json();
    //await apiServices.saveBookReference(bookId);
    res.status(200).send({ bookId, message: "Books fetch successful." });
  })
);

/* router.post(
  "/api/auth/ideas/ideaId/books",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const userId = req.user.id; // Assume you have the user's ID from authentication
    const ideaId = req.params.ideaId;
    const bookReference = req.body; // Book reference data sent from the client
    //await saveBookReference(userId, ideaId, bookReference);
    res.status(200).json({ message: "Book reference saved successfully" });
  })
); */


router.get(
  "/api/auth/movies/search",
  isAuthenticated,
  catchAsync(async (req, res, next) => {
    console.log("apiRouters-getFilm is hit.");
    const searchQuery = req.query.q;
    console.log("apiRouters-getFilm searchQuery:", searchQuery);
    if (!searchQuery) {
      return next(new AppError("No search query provided.", 400));
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.THE_MOVIES_DB_API_KEY}&query=${encodeURIComponent(searchQuery)}`);
    console.log("apiRouter-apiGetRouterFilm response:", response);
    const filmId = await response.json();
    //await apiServices.saveBookReference(bookId);
    res.status(200).send({ filmId, message: "Films fetch successful." });
  })
);

export default router;
