import { admin } from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

const isAuthenticated = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return next(new AppError("No token provided.", 401));
  }
  const idToken = header.split(" ")[1]; // Extract the token from 'Bearer <token>'
  if (!idToken) {
    return next(new AppError("No bearer token provided.", 401));
  }
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  req.user = decodedToken;
  next();
});

export default isAuthenticated;
