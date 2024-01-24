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
    const searchQuery = req.query.q;
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
    res.status(200).send({ bookId, message: "Books fetch successful." });
  })
);

router.get(
  "/api/auth/movies/search",
  isAuthenticated,
  catchAsync(async (req, res, next) => {
    const searchQuery = req.query.q;
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
