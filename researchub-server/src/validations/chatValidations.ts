import z from "zod";

export const docIdParamsSchema = z.object({
  docId: z.string().min(1, "docId is required"),
});

export const sessionIdSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
});

export const questionQuerySchema = z.object({
  question: z.string().min(1, "question is mandatory"),
});

export const updateChatTitleSchema = z.object({
  title: z.string().min(1, "New Title to update is required"),
});
