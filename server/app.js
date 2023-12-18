import "dotenv/config";

//===================FIRESTORE SETUP=====================//

//===================EXPRESS SETUP=====================//
import express from "express";
const app = express();
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//===================ERROR HANDLING=====================//
import errorMiddleware from './middleware/errorMiddleware.js';
app.use(errorMiddleware);


//===================CORS SETUP=====================//
import cors from "cors";
/* app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 204,
})); */
app.use(cors({
    credentials: true,
    origin: true
}));

import { testDB } from "./services/userServices.js";
app.get("/createdummyusers", (req, res) => {
    testDB();
    res.send("200");
})


//===================ROUTERS=====================//
import authRouters from "./routers/authRouters.js";
app.use(authRouters);

import adminRouters from "./routers/adminRouters.js";
app.use(adminRouters);

import userRouters from "./routers/userRouters.js";
app.use(userRouters);

import ideaRouters from "./routers/ideaRouters.js";
app.use(ideaRouters);


//Server Test
app.get("/test", (req, res) => {
    res.send('Test endpoint is working')
});


//===================SERVER===================//
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port ", PORT))