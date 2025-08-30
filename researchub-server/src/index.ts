import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chatRouter";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT ?? 1025;
//port should always be used in the range 1024 above till 65535
//port below 1024 are used by internal systems for communication like HTTP on 80/ SMTP on 25
const MONGO_DB_URL =
  process.env.MONGO_DB_URL ?? "http://localhost:27017/ai-document-summarizer";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/chat/health", (_, res) => res.json({ serverIsLive: true }));

app.use("/chat", chatRouter);

mongoose
  .connect(MONGO_DB_URL)
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.error("Error while connecting to mongo db", err));

app.listen(PORT, () => {
  console.log(`App Listening on PORT: ${PORT}`);
});
