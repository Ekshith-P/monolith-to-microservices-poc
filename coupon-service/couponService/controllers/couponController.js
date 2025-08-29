import Coupon from "../models/couponModel.js";

// ✅ Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiry } = req.body;

    if (!code || !discount || !expiry) {
      return res.status(400).json({ error: "All fields (code, discount, expiry) are required" });
    }

    const existing = await Coupon.findOne({ code });
    if (existing) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const coupon = new Coupon({ code, discount, expiry });
    await coupon.save();

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ error: "Server error while creating coupon" });
  }
};

// ✅ Validate a coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }

    if (new Date() > new Date(coupon.expiry)) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    res.json({
      valid: true,
      discount: coupon.discount,
      expiry: coupon.expiry,
      message: "Coupon is valid"
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ error: "Server error while validating coupon" });
  }
};
