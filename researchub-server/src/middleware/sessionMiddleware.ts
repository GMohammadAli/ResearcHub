import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const SESSION_SECRET = process.env?.SESSION_SECRET || "mysecret123";

const MONGO_DB_URL =
  process.env.MONGO_DB_URL ??
  "mongodb://localhost:27017/ai-document-summarizer";

export const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: MONGO_DB_URL,
    ttl: 60 * 60 * 24, //1 day
    autoRemove: "native",
  }),

  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24, //cookie expires after a day
    // secure: true, //to be enabled in prod
    // sameSite: "strict",
  },
});
