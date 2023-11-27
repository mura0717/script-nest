import "dotenv/config";

// Firabase Setup

// Express Setup
import express from "express";
const app = express();
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

import bodyParser from "body-parser";
app.use(bodyParser.json);

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: true
}));



//Server Test
app.get("/", (req, res) => {
    res.send({data: "Script Nest server is running."})
});

import { testDB } from "./services/userServices.js";
app.get("/createdummyusers", (req, res) => {
    testDB();
    res.send("200");
})


//===================ROUTERS=====================//
import authRouters from "./routers/authRouters.js";
app.use(authRouters);

//===================ERROR HANDLING=====================//
import errorMiddleware from './middleware/errorMiddleware.js';
app.use(errorMiddleware);

//===================SERVER===================//
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port ", PORT))