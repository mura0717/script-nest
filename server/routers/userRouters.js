import { Router } from "express";
const router = Router();
import AppError from "../utils/errorHandling/AppError.js";
import { catchAsync } from "../utils/errorHandling/errorHandlers.js";
import userServices from "../services/userServices.js";
import isAdmin from "../middleware/isAdmin.js";

 // User name fetch
router.get("/api/auth/user/profile", catchAsync(async (req, res, next) => {
  const { displayName } = req.query;
  if (!displayName) {  
    return next(new AppError("User's name couldn't fetched.", 401));
  } else {
    res.status(200).json({ success: true, message: "User's name fetched.", data: displayName  });
  }
}));


export default router;