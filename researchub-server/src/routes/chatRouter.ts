import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../middleware/authMiddleware";
import chatController from "../controllers/chatController";
import validate from "../middleware/validateReqMiddleware";
import {
  docIdParamsSchema,
  questionQuerySchema,
  sessionIdSchema,
  updateChatTitleSchema,
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

/**
 * @deprecated
 * This route is deprecated.
 */
router.get(
  "/documents/:docId/summary",
  validate(docIdParamsSchema, "params"),
  chatController.getDocumentSummary,
);

/**
 * @deprecated
 * This route is deprecated.
 */
router.get(
  "/documents/:docId",
  validate(docIdParamsSchema, "params"),
  validate(questionQuerySchema, "query"),
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

router.get("/sessions", chatController.getAllUserChats);

router.post(
  "/sessions/:sessionId/messages",
  validate(sessionIdSchema, "params"),
  validate(questionQuerySchema, "query"),
  chatController.sessionQnA,
);

router.put(
  "/sessions/:sessionId/update-title",
  validate(sessionIdSchema, "params"),
  validate(updateChatTitleSchema, "body"),
  chatController.updateChatTitle,
);

router.delete(
  "/sessions/:sessionId",
  validate(sessionIdSchema, "params"),
  chatController.deleteChat,
);

export default router;
