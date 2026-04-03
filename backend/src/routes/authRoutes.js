import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Rachit
 *               email: rachit@example.com
 *               password: 123456
 *               role: admin
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: rachit@example.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginUser);

export default router;