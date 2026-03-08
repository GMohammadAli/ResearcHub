import { Request, Response } from "express";
import {
  PDFParseResponse,
  readDocument,
  SUPPORTED_FILE_TYPES,
  SupportedFileType,
} from "../services/documentService";
import { DocumentModel } from "../models/Document";
import ApiService from "../services/apiService";
import {
  ChatSessionModel,
  IChatSession,
  isActive,
  MessageRole,
} from "../models/ChatSession";

const getSession = async ({
  docId,
  userId,
  sessionId,
}: {
  docId?: string;
  userId: string;
  sessionId?: string;
}) => {
  try {
    const query: any = { userId: userId, isActive: isActive.Y };

    if (docId) query.docId = docId;
    if (sessionId) query._id = sessionId;

    return await ChatSessionModel.findOne(query);
  } catch (error) {
    console.error("Error while fetching chat session from db: ", error);
  }
};

const getDocument = async ({ docId }: { docId: string }) => {
  try {
    const document = await DocumentModel.findById(docId);
    return document;
  } catch (error) {
    console.error("Error while fetching document from db: ", error);
  }
};

const getSessions = async ({ userId }: { userId: string }) => {
  try {
    const query: any = { userId: userId, isActive: isActive.Y };

    return await ChatSessionModel.find(query);
  } catch (error) {
    console.error(
      `Error while fetching chat sessions from db for user (${userId}): `,
      error,
    );
  }
};

const uploadFile = async (req: Request, res: Response) => {
  const userId = req.session.user?.userId || "";
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const fileType = req.file.originalname
      .split(".")
      .pop() as SupportedFileType;

    if (!SUPPORTED_FILE_TYPES.includes(fileType)) {
      return res.status(415).json({ message: "Unsupported file type" });
    }

    const extractedPdfResponse: PDFParseResponse = await readDocument(
      req.file.path,
      fileType,
    );

    const contentChunks = DocumentModel.chunkContent(extractedPdfResponse.text);

    const Doc = new DocumentModel({
      userId: userId,
      name: req.file.originalname,
      type: fileType,
      content: contentChunks,
      contentWithMetadata: extractedPdfResponse.pages,
      filePath: req.file.path,
      sizeInBytes: Buffer.byteLength(extractedPdfResponse.text, "utf8"),
    });

    // console.log({ filename: Doc.name, fileSize: Doc.sizeInBytes });

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
  const { docId } = req.validated?.params;
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
      error.response?.data?.message || error?.response || error,
    );
    res.status(502).json({
      error: "Proxy Error",
      details: error.response?.data?.error || error,
    });
  }
};

const getAnswerToQuestions = async (req: Request, res: Response) => {
  const { docId } = req.validated?.params;
  const { question } = req.validated?.query;
  if (
    !docId ||
    typeof docId !== "string" ||
    !question ||
    typeof question !== "string"
  )
    return res.status(400).json({
      message: "Missing docId or question",
    });

  try {
    const response = await ApiService.post(
      `/summarize/${docId}/qna?question=${question}`,
    );
    res.status(response.data.status || 200).json(response.data);
  } catch (error: any) {
    console.error(
      `Error while fetching answer for question: ${question}`,
      error,
    );
    res.status(502).json({
      error: "Proxy error",
      details: error.response?.data?.error || error,
    });
  }
};

const generateAudioOverviewUrl = async (req: Request, res: Response) => {
  const { docId } = req.validated?.params;
  if (!docId || typeof docId !== "string")
    return res.status(400).json({
      message: "Missing docId",
    });

  try {
    const response = await ApiService.post(
      `/summarize/${docId}/generate-audio`,
    );
    res.status(response.data.status || 200).json(response.data);
  } catch (error: any) {
    console.error(`Error while fetching audio overview url : ${docId}`, error);
    res.status(502).json({
      error: "Proxy error",
      details: error.response?.data?.error || error,
    });
  }
};

const initializeOrGetExistingChat = async (req: Request, res: Response) => {
  const { docId } = req.validated?.params;
  const userId = req.session.user?.userId || "";
  try {
    const existingSession = await getSession({ docId, userId });
    if (existingSession) {
      return res.status(200).json({
        message: "Existing Chat Session Found",
        data: existingSession.toObject(),
      });
    }

    const documentDetails = await getDocument({ docId });
    if (!documentDetails)
      return res.status(404).json({ message: "Document not found" });

    if (documentDetails.userId.toString() !== userId)
      return res.status(403).json({ message: "Forbidden" });

    const newSession = await ChatSessionModel.create({
      userId: userId,
      docId: docId,
      title: documentDetails.name,
      messages: [],
      isActive: isActive.Y,
    });

    const summaryResp = await ApiService.get(`/summarize/${docId}`);
    const generatedSummaryDetails = summaryResp.data;

    if (generatedSummaryDetails) {
      newSession.messages.push({
        role: MessageRole.AGENT,
        content: generatedSummaryDetails.summary,
        citations: generatedSummaryDetails.citations,
        isSummary: true,
      });
    }

    await newSession.save();

    return res.status(201).json({
      message: "New Session Created",
      data: newSession.toObject(),
    });
  } catch (error: any) {
    console.error(
      `Error while fetching/initializing existing chat: ${docId}`,
      error,
    );
    res.status(502).json({
      error: "Proxy error",
      details: error.response?.data?.error || error,
    });
  }
};

const sessionQnA = async (req: Request, res: Response) => {
  const { sessionId } = req.validated?.params;
  const { question } = req.validated?.query;
  const userId = req.session.user?.userId || "";

  try {
    const existingSession = await getSession({ sessionId, userId });
    if (!existingSession) {
      return res.status(404).json({
        message: "Session not found/ User not authorized",
        data: null,
      });
    }

    existingSession.messages.push({
      role: MessageRole.USER,
      content: question,
      citations: [],
    });

    const docId = existingSession.docId;

    const response = await ApiService.post(
      `/summarize/${docId}/qna?question=${question}`,
    );
    if (response.data.success) {
      existingSession.messages.push({
        role: MessageRole.AGENT,
        content: response.data.answer,
        citations: response.data.citations,
      });

      await existingSession.save();

      return res.status(200).json({
        message: "Answer Generated Successfully",
        data: existingSession.toObject(),
      });
    } else {
      throw Error("Unhandled/Invalid Response from AI Engine");
    }
  } catch (error: any) {
    console.error(
      `Error while fetching answer to a new question  (${question}) for an existing chat with id: ${sessionId}`,
      error,
    );
    res.status(502).json({
      error: "Proxy error",
      details: error.response?.data?.error || error,
    });
  }
};

const getAllUserChats = async (req: Request, res: Response) => {
  const userId = req.session.user?.userId || "";
  try {
    const sessions: IChatSession[] | undefined = await getSessions({ userId });
    if (!sessions) {
      return res.status(404).json({
        message: "User has no active sessions/chats",
        data: null,
      });
    }
    return res.status(200).json({
      message: "User Sessions Found",
      data: {
        sessions,
        totalSessions: Object.keys(sessions).length,
      },
    });
  } catch (error: any) {
    console.error(
      `Error while fetching all session created by user with userId : ${userId}`,
      error,
    );
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data?.error || error,
    });
  }
};

const deleteChat = async (req: Request, res: Response) => {
  const { sessionId } = req.validated?.params;
  const userId = req.session.user?.userId || "";
  try {
    const existingSession = await getSession({ sessionId, userId });
    if (!existingSession) {
      return res.status(404).json({
        message: "Session not found/ User not authorized",
        data: null,
      });
    }

    existingSession.isActive = isActive.N;

    await existingSession.save();

    return res.status(200).json({
      message: "Session deleted successfully",
    });
  } catch (error: any) {
    console.error(
      `Error while deleting a session with sessionId : ${sessionId}`,
      error,
    );
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data?.error || error,
    });
  }
};

const updateChatTitle = async (req: Request, res: Response) => {
  const { sessionId } = req.validated?.params;
  const userId = req.session.user?.userId || "";
  const { title: newTitle } = req.validated?.body;
  try {
    const existingSession = await getSession({ sessionId, userId });
    if (!existingSession) {
      return res.status(404).json({
        message: "Session not found/ User not authorized",
        data: null,
      });
    }

    existingSession.title = newTitle;

    await existingSession.save();

    return res.status(200).json({
      message: "Session title updated successfully",
      data: existingSession.toObject(),
    });
  } catch (error: any) {
    console.error(
      `Error while updating session title with sessionId : ${sessionId}`,
      error,
    );
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data?.error || error,
    });
  }
};

export default {
  uploadFile,
  getDocumentSummary,
  getAnswerToQuestions,
  generateAudioOverviewUrl,
  initializeOrGetExistingChat,
  sessionQnA,
  getAllUserChats,
  updateChatTitle,
  deleteChat,
};
