import { admin } from "../config/firebaseAdmin.js";
import AppError from '../utils/ErrorHandling/AppError.js';
import authRouter from "../routers/authRouter.js"

export const signupServices = {
  registerUserWithFirebase: async (newUser) => {
    console.log("authServices-registerUserWithFirebase is hit.")
    const { name, email, password } = newUser;
    try {
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
      });
      console.log("authServices-userRecord:", userRecord);
      return userRecord;
    } catch (error) {
      console.log(error);
      throw new AppError("Error registering user.", 500);
    }
  },
};

export const loginServices = {
  verifyIdToken: async (idToken) => {
    console.log("authServices-loginServices is hit.");
    console.log("authServices-idToken:", idToken);
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log("authServices-decoded token:", decodedToken);
      console.log("authServices-uid:", decodedToken.uid);
      return decodedToken;
    } catch (error) {
      console.log(error);
      throw new AppError("Error logging user in.", 500);
    }
  },
};
