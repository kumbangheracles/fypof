import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://fypof-fe.vercel.app",
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

// koneksi DB dijalankan saat module di-load
db()
  .then((result) => {
    console.log("Database status: ", result);
  })
  .catch((error) => {
    console.error("Database connection failed: ", error);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
