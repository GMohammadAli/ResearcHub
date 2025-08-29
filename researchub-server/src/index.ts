import dotenv from "dotenv";
import express from "express";
import chatRouter from "./routes/chatRouter";

dotenv.config();

const PORT = process.env.PORT ?? 1025;
//port should always be used in the range 1024 above till 65535
//port below 1024 are used by internal systems for communication like HTTP on 80/ SMTP on 25

const app = express();

app.use(express.json());

app.get("/chat/health", (_, res) => res.json({ serverIsLive: true }));

app.use("/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`App Listening on PORT: ${PORT}`);
});
