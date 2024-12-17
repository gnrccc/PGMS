import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeUserOrAdmin } from "../middleware/role.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.put(
  "/update-profile/:id",
  verifyToken,
  authorizeUserOrAdmin,
  updateProfile
);

export default router;
