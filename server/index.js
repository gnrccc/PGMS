import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import authRouter from "./routers/auth.route.js";
import userRouter from "./routers/user.route.js";
import adminRouter from "./routers/admin.route.js";

dotenv.config();

// Start the server
const PORT = process.env.PORT;

// Auth routes
app.use("/api/auth", authRouter);

// User routes
app.use("/api/user", userRouter);

// Admin routes
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
