import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    setTimeout(connectDB, 5000);
  }
};
