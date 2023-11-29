import { Router } from "express";
const router = Router();

import AppError from '../utils/error_handling/AppError.js';
import { catchAsync } from "../utils/error_handling/errorHandlers.js";
import { signupServices } from "../services/authServices.js";
import { loginServices } from "../services/authServices.js";
import { requireLogin } from "../middleware/requireLogin.js";


//USER SIGNUP
router.post("/api/auth/signup", catchAsync(async (req, res, next) => {
    console.log("signup endpoint is hit");
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    await signupServices.registerUserWithFirebase(newUser);
    res.status(200).json({ success: true, message: "User registered successfully." });
}))

// USER LOGIN
router.post("/api/auth/login", catchAsync(async (req, res, next) => {
    console.log("login endpoint is hit.")
    console.log("Received request body:", req.body);
    const idToken = req.body.idToken;
    console.log("Received ID Token:", idToken);
    if (!idToken) {
        return next(new AppError("ID token is missing from the request.", 400));
      }
    await loginServices.verifyIdToken(idToken);
    res.status(200).json({ success: true, message: "User logged in successfully." });
}));

  // LOGIN CHECK
router.get('/api/auth/login/guard', requireLogin, (req, res) => {
    const userToken = req.body.idToken;
    if(userToken) {
      res.status(200).json({ status: 200, message: "Logged in." });
    } else {
      res.send(401).json({ message: 'Not logged in.'});
    }
  });

  // Admin-specific routes
router.post('/admin/create');
router.get('/admin/users');

export default router;