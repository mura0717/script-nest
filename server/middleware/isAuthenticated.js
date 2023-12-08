import admin from "../config/firebaseAdmin.js";
import AppError from "../utils/errorHandling/AppError.js";
import { catchAsync } from "../utils/errorHandling/errorHandlers.js";

const isAuthenticated = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return next(new AppError("No token provided.", 401));
  }
  // Extract the token from 'Bearer <token>'
  const idToken = header.split(" ")[1];
  if (!idToken) {
    return next(new AppError("No bearer token provided.", 401));
  }
  await admin.auth().verifyIdToken(idToken);
  next();
});

export default isAuthenticated;
