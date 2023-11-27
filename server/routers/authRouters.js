import { Router } from "express";
const router = Router();

import { signupServices } from "../services/authServices.js";
import { loginServices } from "../services/authServices.js";
import { requireLogin } from "../middleware/requireLogin.js"

//USER SIGNUP
router.post("/api/auth/signup", async (req, res) => {
  try {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    await signupServices.registerUserWithFirebase(newUser);
    res.status(200).json({ status: 200, message: "User registered successfully." });
  } catch (error) {
    console.error("Error in signup endpoint:", error);
    res.send(500).json("Error registering user.");
  }
});

// USER LOGIN
router.post("/api/auth/login", async (req, res) => {
    try {
        const idToken = req.body.idToken;
        await loginServices.verifyIdToken(idToken);
        res.status(200).json({ status: 200, message: "User registered successfully." });
    } catch (error) {
      console.error("Error in login endpoint:", error);
      res.send(500).json({ message: "Error loggin in.", error });
    }
  });
  
  // USER LOGOUT
/*   router.get("/api/auth/logout", (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error("Error logout endpoint:", error);
        res.send(500).json({ error: "Error logging out." });
      } else {
        res.status(200).json({ message: "Logout successful." });
      }
    });
  }); */

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