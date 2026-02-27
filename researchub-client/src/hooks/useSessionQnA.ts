import { useState, useCallback } from "react";
import { toast } from "sonner";
import ApiService from "../services/ApiService";
import { Citation } from "@/types/citations.types";

interface ChatMessage {
  role: "agent" | "user";
  content: string;
  citations: Citation[];
  isSummary?: boolean;
}

interface SessionData {
  _id: string;
  userId: string;
  docId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface SessionResponse {
  message: string;
  data?: SessionData;
}

export const useSessionQnA = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const askQuestion = useCallback(
    async (sessionId: string | null, question: string) => {
      if (!sessionId || !question.trim()) return;

      setLoading(true);

      try {
        const res = await ApiService.post<SessionResponse>(
          `/chat/sessions/${sessionId}/messages?question=${encodeURIComponent(
            question,
          )}`,
        );

        if (res.status === 200 && res.data?.data) {
          setSession(res.data.data);
          return res.data.data;
        } else {
          toast.error(res.data?.message || "Failed to generate answer");
        }
      } catch (error) {
        console.error(
          `Error while asking question for session ${sessionId}`,
          error,
        );
        toast.error("Error while generating answer.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    session,
    loading,
    askQuestion,
  };
};
