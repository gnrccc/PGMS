import express from "express";
import {
  login,
  createAdmin,
  logout,
  check,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-admin", createAdmin);
router.post("/logout", logout);
router.get("/check", verifyToken, check);
router.get("/check-admin", checkAdmin);

export default router;
