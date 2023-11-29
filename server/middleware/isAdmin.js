import admin from "firebase-admin";
import AppError from "../utils/errorHandling/AppError.js";

 async function isAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return next(new AppError("No token provided.", 401));
  }
  const decodedToken = await admin.auth().verifyIdToken(token);
  if (decodedToken.isAdmin) { // Checks if the decoded token has isAdmin claim present.
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    next(new AppError("Access denied. Admins only.", 403));
  }
}

export default isAdmin;
