import { Router } from "express";
import { loginWithGoogle } from "../controllers/authController";

const router = Router();

router.post("/google", loginWithGoogle);
router.post("/login");

export default router;
