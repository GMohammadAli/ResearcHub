import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chatRouter";
import mongoose from "mongoose";
import cronService from "./services/cronService";
import authRouter from "./routes/authRouter";
import { sessionMiddleware } from "./middleware/sessionMiddleware";

dotenv.config();

const PORT = process.env.SERVER_PORT ?? 1025;
//port should always be used in the range 1024 above till 65535
//port below 1024 are used by internal systems for communication like HTTP on 80/ SMTP on 25
const MONGO_DB_URL =
  process.env.MONGO_DB_URL ??
  "mongodb://localhost:27017/ai-document-summarizer";
const CLIENT_APP_URL = process.env.CLIENT_APP_URL ?? "http://localhost:3000";

const app = express();

/* REQUIRED FOR RENDER + SECURE COOKIES */
// Because prod server is running on Render behind a proxy, Express does not detect HTTPS correctly.
app.set("trust proxy", 1);

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_APP_URL,
    credentials: true, // Allow cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(sessionMiddleware);

// GITHUB Actions CRON implemented
// that would ping servers every 10 mins just won't be part of any service
// check -> .github/workflows/keepAlive.yml
// cronService.init();

app.use("/auth", authRouter);
app.use("/chat", chatRouter);

mongoose
  .connect(MONGO_DB_URL)
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.error("Error while connecting to mongo db", err));

app.listen(PORT, () => {
  console.log(`App Listening on PORT: ${PORT}`);
});
