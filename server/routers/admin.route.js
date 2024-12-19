import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getAllStaff,
  createUser,
  deleteUser,
} from "../controllers/admin.controller.js";
import {
  getAllValidities,
  createValidity,
  updateValidity,
  deleteValidity,
} from "../controllers/validity.controller.js";
import {
  getAllRates,
  createRate,
  updateRate,
  deleteRate,
} from "../controllers/rate.controller.js";

const router = express.Router();

// Staff routes
router.get("/staffs", verifyToken, authorize("admin"), getAllStaff);
router.post("/create-user", verifyToken, authorize("admin"), createUser);
router.delete("/delete-user/:id", verifyToken, authorize("admin"), deleteUser);

// Validity routes
router.get("/validities", verifyToken, authorize("admin"), getAllValidities);
router.post(
  "/create-validity",
  verifyToken,
  authorize("admin"),
  createValidity
);
router.put(
  "/update-validity/:id",
  verifyToken,
  authorize("admin"),
  updateValidity
);
router.delete(
  "/delete-validity/:id",
  verifyToken,
  authorize("admin"),
  deleteValidity
);

// Rate routes
router.get("/rates", verifyToken, authorize("admin"), getAllRates);
router.post("/create-rate", verifyToken, authorize("admin"), createRate);
router.put("/update-rate/:id", verifyToken, authorize("admin"), updateRate);
router.delete("/delete-rate/:id", verifyToken, authorize("admin"), deleteRate);

export default router;
