const axios = require("axios");
const Cart = require("../models/Cart");

module.exports = {
  applyCouponInCart: async (req, res) => {
    try {
      const { cartId, couponCode } = req.body;
      const cart = await Cart.findById(cartId);

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      // Call coupon-service (port 5001, /validate route)
      const { data } = await axios.post("http://localhost:5001/api/coupons/validate", {
        code: couponCode
      });

      if (data.valid) {
        const discountAmount = (cart.totalPrice * data.discount) / 100;

        cart.couponApplied = discountAmount;
        cart.totalPrice = cart.totalPrice - discountAmount;
        cart.coupon = data._id; // couponId returned from microservice
        await cart.save();

        return res.json({ status: "ok", cart });
      } else {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }
    } catch (error) {
      console.error("Coupon Service Error:", error.message);
      return res.status(500).json({ message: "Coupon service unavailable" });
    }
  },

  removeCouponFromCart: async (req, res) => {
    try {
      const { cartId } = req.body;
      const cart = await Cart.findById(cartId);

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      // Removing coupon locally (optional: also notify coupon-service if needed)
      cart.totalPrice += cart.couponApplied;
      cart.couponApplied = 0;
      cart.coupon = null;
      await cart.save();

      return res.json({ status: "ok", cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
