import "dotenv/config";
import admin from "../config/firebaseAdmin.js";
import AppError from "../utils/errorHandling/AppError.js";

// This could be part of a one-time setup script or a special admin-only endpoint
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

// Call this function with the UID of the initial admin user
setInitialAdminUser("4rTkYbETINR5uj0F55bFw5kspRG3");
