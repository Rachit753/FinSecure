import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";

import { protect } from "./middleware/authMiddleware.js";
import { allowRoles } from "./middleware/roleMiddleware.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

import swaggerSpec from "./utils/swagger.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

app.get(
  "/api/admin-only",
  protect,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

app.get(
  "/api/analyst",
  protect,
  allowRoles("analyst", "admin"),
  (req, res) => {
    res.json({ message: "Welcome Analyst or Admin!" });
  }
);

export default app;