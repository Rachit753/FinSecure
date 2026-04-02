import express from "express";

import { createRecord } from "../controllers/recordController.js";
import { getRecords } from "../controllers/recordController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createRecord);
router.get("/", protect, allowRoles("viewer", "analyst", "admin"), getRecords);

export default router;