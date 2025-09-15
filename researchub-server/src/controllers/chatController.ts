import { Request, Response } from "express";
import { readDocument, SupportedFileType } from "../services/documentService";
import { DocumentModel } from "../models/Document";
import ApiService from "../services/apiService";

const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const fileType = req.file.originalname
      .split(".")
      .pop() as SupportedFileType;

    const text = await readDocument(req.file.path, fileType);

    const contentChunks = DocumentModel.chunkContent(text);

    const Doc = new DocumentModel({
      name: req.file.originalname,
      type: fileType,
      content: contentChunks,
      filePath: req.file.path,
      sizeInBytes: Buffer.byteLength(text, "utf8"),
    });

    console.log({ filename: Doc.name, fileSize: Doc.sizeInBytes });

    await Doc.save();

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully!!",
      documentId: Doc._id,
    });
  } catch (error) {
    console.error("Error while data extraction of file", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDocumentSummary = async (req: Request, res: Response) => {
  const { docId } = req.params;
  if (!docId)
    return res.status(400).json({
      message: "Bad Request",
    });

  try {
    const response = await ApiService.get(`/summarize/${docId}`);
    res.status(response.data.status || 200).json(response.data);
  } catch (error: any) {
    console.error(
      `Error while fetching document summary for docId: ${docId}`,
      error.response?.data?.message || error?.response || error
    );
    res.status(500).json({
      error: "Proxy Error",
      details: error.response?.data?.error || error,
    });
  }
};

const getAnswerToQuestions = async (req: Request, res: Response) => {
  const { docId } = req.params;
  const { question } = req.query;
  if (
    !docId ||
    typeof docId !== "string" ||
    !question ||
    typeof question !== "string"
  )
    return res.status(400).json({
      message: "Bad Request",
    });

  try {
    const response = await ApiService.post(
      `/summarize/${docId}/?question=${question}`
    );
    res.status(response.data.status || 200).json(response.data);
  } catch (error: any) {
    console.error(
      `Error while fetching answer for question: ${question}`,
      error
    );
    res.status(500).json({
      error: "Proxy error",
      details: error.response?.data?.error || error,
    });
  }
};

export default {
  uploadFile,
  getDocumentSummary,
  getAnswerToQuestions,
};
