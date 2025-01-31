import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// settings for cookies options
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for url
app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.route.js";
app.use("/api/v1/user",userRouter)



export { app };
