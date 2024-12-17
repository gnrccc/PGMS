import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getAllStaff,
  createUser,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/staffs", verifyToken, authorize("admin"), getAllStaff);
router.post("/create-user", verifyToken, authorize("admin"), createUser);
router.delete("/delete-user/:id", verifyToken, authorize("admin"), deleteUser);

export default router;
