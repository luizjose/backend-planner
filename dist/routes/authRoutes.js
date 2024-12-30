"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("Hello from auth routes");
});
router.post("/google", authController_1.loginWithGoogle);
router.post("/login");
exports.default = router;
