import "dotenv/config";

//===================EXPRESS SETUP=====================//
import express from "express";
const app = express();
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//===================ERROR HANDLING=====================//
import errorMiddleware from "./middleware/errorMiddleware.js";
app.use(errorMiddleware);

//===================SESSION SECRET CREATION=======================//

// Use it to create a session secret.
/* import crypto from "crypto";
const sessionSecret = crypto.randomBytes(64).toString("hex");
console.log(sessionSecret);
 */
//===================SESSION SETUP=======================//

import session from "express-session";
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
app.use(sessionMiddleware);

//===================SOCKET IO SETUP=====================//

import { socketServer } from "./sockets/sockets.js";
const server = socketServer(app);

//===================CORS SETUP=====================//
import cors from "cors";
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
// Alternative CORS Settings
/* app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 204,
})); */

//===================ROUTERS=====================//

import adminRouter from "./routers/adminRouter.js";
app.use(adminRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import ideasRouter from "./routers/ideasRouter.js";
app.use(ideasRouter);

import apiRouter from "./routers/apiRouter.js";
app.use(apiRouter);

import collabRouter from "./routers/collabRouter.js";
app.use(collabRouter);

//===================SERVER===================//
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server is running on port ", PORT));

