import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import couponRoutes from "./routes/couponRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

// connect db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB connection error:", err));

// routes
app.use("/", checkoutRouter);
app.use("/api/coupons", couponRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Coupon service running on port ${PORT}`));
