import express from "express";

import {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    getSummary,
    getCategorySummary,
    getMonthlyTrends,
    getRecentActivity
} from "../controllers/recordController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createRecord);
router.get("/", protect, allowRoles("viewer", "analyst", "admin"), getRecords);
router.put("/:id", protect, allowRoles("admin"), updateRecord);
router.delete("/:id", protect, allowRoles("admin"), deleteRecord);
router.get(
    "/summary",
    protect,
    allowRoles("viewer", "analyst", "admin"),
    getSummary
);

router.get(
    "/summary/category",
    protect,
    allowRoles("viewer", "analyst", "admin"),
    getCategorySummary
);

router.get(
    "/summary/monthly",
    protect,
    allowRoles("viewer", "analyst", "admin"),
    getMonthlyTrends
);

router.get(
    "/recent",
    protect,
    allowRoles("viewer", "analyst", "admin"),
    getRecentActivity
);

export default router;