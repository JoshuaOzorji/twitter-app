import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signup", login);
router.post("/signup", logout);

export default router;
