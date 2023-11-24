import "dotenv/config";

//DB Setup
//import * as dbConnection from './config/firebase/firebaseConfig.js'
//import { setupDatabase } from "./config/database/createDatabase.js";

// Firabase Setup

// Express Setup
import express from "express";
const app = express();
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());



/* import bodyParser from "body-parser";
app.use(bodyParser.json); */

/* import cors from "cors";
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 204,
})); */



app.get("/", (req, res) => {
    res.send({data: "Script Nest server is running."})
});

import { testDB } from "./services/usersServices.js";
app.get("/createdummyusers", (req, res) => {
    testDB();
    res.send("200");
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port ", PORT))