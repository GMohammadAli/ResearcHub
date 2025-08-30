import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../middleware/authMiddleware";
import chatController from "../controllers/chatController";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.use(isAuthenticated);

//TODO, implement zod validations later on in backend
//TODO, implement a job task via a worker(not necessarily) to delete a file
//when a document for it is already created

router.post(
  "/documents/upload",
  upload.single("document"),
  chatController.uploadFile
);

export default router;
