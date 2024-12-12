import express from "express";
const app = express();
import cors from "cors";

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to allow all origins
app.use(cors());

export default app;
