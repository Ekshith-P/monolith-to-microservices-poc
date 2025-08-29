const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "Checkout working!" });
});

router.post("/checkout", async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body;

    // Call coupon-service
    const response = await axios.post("http://localhost:4000/api/coupons/validate", {
      code: couponCode
    });

    const coupon = response.data;

    if (!coupon.valid) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    // Apply discount
    const finalPrice = cartTotal - coupon.discount;

    res.json({
      message: "Checkout successful",
      originalPrice: cartTotal,
      discount: coupon.discount,
      finalPrice,
      expiry: coupon.expiry
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during checkout" });
  }
});

module.exports = router;
