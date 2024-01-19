import admin from "firebase-admin";
import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

const isAdmin = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  const idToken = header.split(" ")[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  if (decodedToken.isAdmin) {
    next();
  } else {
    next(new AppError("Access denied. Admins only.", 403));
  }
});

export default isAdmin;
