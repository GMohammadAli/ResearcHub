import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../middleware/authMiddleware";
import chatController from "../controllers/chatController";
import validate from "../middleware/validateReqMiddleware";
import {
  docIdParamsSchema,
  questionQuerySchema,
  sessionIdSchema,
} from "../validations/chatValidations";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/health", (_, res) => res.json({ serverIsLive: true }));

router.use(isAuthenticated);

//TODO, implement a job task via a worker(not necessarily) to delete a file
//when a document for it is already created, as of now files get deleted on server restarts

router.post(
  "/documents/upload",
  upload.single("document"),
  chatController.uploadFile,
);

router.get(
  "/documents/:docId/summary",
  validate(docIdParamsSchema, "params"),
  chatController.getDocumentSummary,
);

router.get(
  "/documents/:docId",
  validate(docIdParamsSchema, "params"),
  chatController.getAnswerToQuestions,
);

router.post(
  "/documents/:docId/generate-audio-overview",
  validate(docIdParamsSchema, "params"),
  chatController.generateAudioOverviewUrl,
);

router.post(
  "/documents/:docId/session",
  validate(docIdParamsSchema, "params"),
  chatController.initializeOrGetExistingChat,
);

router.post(
  "/sessions/:sessionId/messages",
  validate(sessionIdSchema, "params"),
  validate(questionQuerySchema, "query"),
  chatController.sessionQnA,
);

export default router;
