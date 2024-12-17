import express from "express";
import {
  login,
  createAdmin,
  logout,
  check,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-admin", createAdmin);
router.post("/logout", logout);
router.get("/check", verifyToken, check);

export default router;
