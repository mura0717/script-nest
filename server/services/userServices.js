import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createFirebaseApp } from "../config/firebaseServerConfig.js";
import admin from "../config/firebaseAdmin.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

const app = createFirebaseApp()
const db = getFirestore(app)

const userServices = {

  getUser: async (userId) => {

  },
  
  getAllUsers: async () => {
  
  },
  
  /* export const createUser = async (userData) => {
   
  } */
  
  editUser: catchAsync(async (userId, updates) => {
    console.log("userServices-editUser-userId & updates:", userId, updates)
    await admin.auth().updateUser(userId, updates);
    return { success: true };
  }),
  
  deleteUser: async (userId) => {
   
  }

};


//firebase collection
const collectionName = "users";

//dummy user creator
const createUser = (Name, Email, Password, isAdmin) => {
  return {
    Name,
    Email,
    Password,
    isAdmin,
  };
};

const createDummyUsers = () => {

let dummyUsersList = [];

  const adminUser = createUser(
    "Alex Johnson",
    "alex.johnson@example.com",
    "AdminPass123!",
    true
  );
  const user1 = createUser(
    "Jamie Smith",
    "jamie.smith@example.com",
    "UserPass123!",
    false
  );

  dummyUsersList.push(adminUser, user1);
  return dummyUsersList;
};

export const testDB = async () => {
    const users = createDummyUsers()

    const colRef = collection(db,collectionName)

    users.forEach(async u => {
        await addDoc(colRef,u)
        .catch((err) =>  console.log(err))
    })

}



export default userServices;

