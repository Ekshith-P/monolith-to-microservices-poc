Monolith to Microservices POC – Coupon Service Extraction
Project Overview

This project demonstrates how to extract a service from a Node.js monolith into an independent microservice using the Strangler Pattern.

Original app: BytEz
 – a Node.js/Express/MongoDB e-commerce monolith.

Extracted service: Coupon Service.

Goal: Show how coupon-related logic can be moved into a standalone microservice while keeping the monolith functional.

HEAD
 Watch the 3-min Demo Video here: Demo Video

 Architecture

Watch the 3-min Demo Video here: Demo Video
Architecture
d875b43 (Restructure: add monolith + coupon-service as folders)
Before (Monolith)
+----------------+
|  BytEz Monolith|
|  (cart, orders,|
|  coupons, etc.)|
+----------------+

After (Hybrid System)
+------------------+        API Call        +--------------------+
|  BytEz Monolith  | ---------------------> |  Coupon Microservice|
| (cart, orders)   |                        | (coupon CRUD + validation) |
+------------------+                        +--------------------+

Setup Instructions
1. Clone the Repo
git clone https://github.com/<your-username>/monolith-to-microservices-poc.git
cd monolith-to-microservices-poc

2. Setup the Monolith (bytez-monolith)
cd bytez-monolith
npm install
cp .env.example .env


Update .env with:

MONGO_URI=<your-mongo-connection-string>

JWT_SECRET=<your-secret>

Run:

npm start


Monolith runs at http://localhost:3000
.

3. Setup the Microservice (coupon-service)
cd ../coupon-service
npm install
cp .env.example .env


Update .env with:

MONGO_URI=<your-mongo-connection-string>

PORT=5001

Run:

npx nodemon server.js


Coupon service runs at http://localhost:5001
.

4. API Endpoints (Coupon Service)
➤ Create Coupon
POST /api/coupons
Content-Type: application/json

{
  "code": "SAVE10",
  "discount": 10,
  "expiry": "2025-12-31"
}

➤ Validate Coupon
POST /api/coupons/validate
Content-Type: application/json

{
  "code": "SAVE10"
}

Integration with Monolith

Inside bytez-monolith/controllers/cartController.js (or orderController.js), the old coupon lookup is replaced with an Axios call:

// LEGACY CODE - Replaced by microservice
// const coupon = await Coupon.findOne({ code: req.body.code });

import axios from "axios";

const response = await axios.post("http://localhost:5001/api/coupons/validate", {
  code: req.body.code
});
const coupon = response.data;


Now, when a coupon is applied, the monolith calls the coupon microservice.

Demo Flow

Start monolith (port 3000).

Start coupon-service (port 5001).

In the BytEz UI, apply a coupon.

Logs appear in both terminals:

Monolith → outbound API request.

Coupon Service → receives & validates request.

Strangler Pattern applied: old logic left in place but replaced with API calls.

Microservice runs independently → can be deployed separately.

Demonstrates scalability, maintainability, and separation of concerns.
  
Author: Ekshith
