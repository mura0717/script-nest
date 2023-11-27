import admin from "../config/firebaseAdmin.js";

export const signupServices = {
  registerUserWithFirebase: async (newUser) => {
    const { name, email, password } = newUser;
    try {
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
      });
      return { success: true, userRecord };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error registering user." };
    }
  },
};

export const loginServices = {
  verifyIdToken: async (idToken) => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return { success: true, decodedToken };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error logging user in." };
    }
  },
};
