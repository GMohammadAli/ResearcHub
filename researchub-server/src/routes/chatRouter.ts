import { Router } from "express";

const router = Router();

router.post("/upload/document", (req, res) => {
  res.status(201).json({
    message: "Upload document api got hit!!",
    success: true,
  });
});

export default router;
