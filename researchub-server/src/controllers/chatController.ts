import { Request, Response } from "express";
import { readDocument, SupportedFileType } from "../services/documentService";
import { DocumentModel, IDocument } from "../models/document";

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

export default {
  uploadFile,
};
