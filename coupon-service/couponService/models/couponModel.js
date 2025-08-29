import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },   // percentage or flat discount
  expiry: { type: Date, required: true }        // expiry date
});

export default mongoose.model("Coupon", couponSchema);
