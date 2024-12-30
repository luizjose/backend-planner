import { Router } from "express";
import { loginWithGoogle } from "../controllers/authController";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello from auth routes");
    }
);

router.post("/google", loginWithGoogle);
router.post("/login");

export default router;
