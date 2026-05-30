import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";
import { CORS_ORIGIN_URL } from "./utils/env";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    data: "null",
  });
});

app.use("/api", router);
docs(app);

db()
  .then((result) => {
    console.log("Database status: ", result);
  })
  .catch((error) => {
    console.error("Database connection failed: ", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
