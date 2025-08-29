import express from "express";
import { createCoupon, validateCoupon } from "../controllers/couponController.js";

const router = express.Router();

// Create new coupon
router.post("/", createCoupon);

// Validate coupon
router.post("/validate", validateCoupon);

export default router;
