"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//const cors = require("cors");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
const app = (0, express_1.default)();
const port = 3001;
//app.use(cors());
app.use(express_1.default.json());
app.use("/api", authRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/protected", protectedRoutes_1.default);
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
