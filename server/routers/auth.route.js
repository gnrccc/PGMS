import express from "express";
import { login, createAdmin, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-admin", createAdmin);
router.post("/logout", logout);

export default router;
