import express from "express";
//const cors = require("cors");
import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import { router } from "./routes/routes";

const app = express();

const port = 3001;
//app.use(cors());
app.use(express.json());

app.use("/api", authRoutes );
app.use("/api/auth", authRoutes);

app.use("/api/protected", protectedRoutes);



app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
