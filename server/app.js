import express from "express";
const app = express();
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to allow all origins
app.use(cors());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to handle errors
app.use(errorHandler);

export default app;
