import express from "express";
//const cors = require("cors");
import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";

const app = express();

const port = 3001;
//app.use(cors());
app.use(express.json());
app.use("/api", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/auth", authRoutes);

app.use("/api/protected", protectedRoutes);



app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
