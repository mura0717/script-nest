import { Router } from "express";
const router = Router();
import admin from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import {
  catchAsync,
  handleError,
} from "../utils/ErrorHandling/GlobalErrorHandler.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import userServices from "../services/userServices.js";

// User name fetch
router.get(
  "/api/auth/user/profile",
  isAuthenticated,
  catchAsync(async (req, res, next) => {
    const { displayName } = req.query;
    if (!displayName) {
      return next(new AppError("Username couldn't be fetched.", 401));
    } else {
      res.status(200).json({
        success: true,
        message: "Username fetched.",
        data: displayName,
      });
    }
  })
);

//User Record Fetch by Email for Collaborator Invite
router.get(
  "/api/auth/user/inviteUserByEmail",
  isAuthenticated,
  catchAsync(async (req, res, next) => {
    const { email } = req.query;
    console.log("userRouter.js - Searched User Email:", email);
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log("userRouter.js - Searched User Record:", userRecord);

      if (userRecord) {
        const userData = {
          displayName: userRecord.displayName,
          email: userRecord.email,
          photoURL: userRecord.photoURL,
        };
        console.log(
          "userRouter.js - Searched User Data to be Sent to Client:",
          userData
        );
        res.status(200).json({
          success: true,
          message: "User Record fetched.",
          data: userData,
        });
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`Error fetching user data: ${error.message}`, 500);
    }
  })
);

export default router;
