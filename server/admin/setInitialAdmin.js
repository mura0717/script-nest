import "dotenv/config";
import admin from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";

// This is a one-time special admin-only endpoint
async function setInitialAdminUser(uid, next) {
  if (!uid) {
    return next(new AppError("No authorized uid provided.", 401));
  }
  try {
    await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
    console.log(`Admin claims set successfully for user: ${uid}`);
  } catch (error) {
    const appError = new AppError("Error setting admin claims", 500);
    console.error(appError.message, error);
  }
}

// Call this function with the UID of a user to set admin status.
setInitialAdminUser("PUT UID HERE");
