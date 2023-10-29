import express from "express";
import blogRoutes from "./routes/blogRoutes.js"
const app = express();
const PORT = 3000;

app.use("/api", blogRoutes);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
