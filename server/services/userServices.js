import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createFirebaseApp } from "../config/firebaseConfig.js";
import admin from "../config/firebaseAdmin.js";

const app = createFirebaseApp()
const db = getFirestore(app)


export const getUser = async (userId) => {

}

export const getAllUsers = async () => {

}

/* export const createUser = async (userData) => {
 
} */

export const editUser = async (userId) => {
 
}

export const deleteUser = async (userId) => {
 
}


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
  const user2 = createUser(
    "Taylor Brown",
    "taylor.brown@example.com",
    "UserPass456!",
    false
  );

  dummyUsersList.push(adminUser, user1, user2);
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



