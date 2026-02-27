import { useState, useCallback, useEffect } from "react";
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

interface SummaryDetails extends ChatMessage {
  documentName: string;
  docId: string;
  createdAt: string;
  summary: string;
}

export const useDocumentSession = (docId: string | null) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryDetails, setSummaryDetails] = useState<SummaryDetails | null>(
    null,
  );

  const createOrFetchSession = useCallback(async () => {
    if (!docId) return;

    setLoading(true);
    setSession(null);

    try {
      const res = await ApiService.post<SessionResponse>(
        `/chat/documents/${docId}/session`,
      );

      if ([200, 201].includes(res.status) && res.data?.data) {
        const session = res.data.data;
        setSession(session);

        const summaryMessage = session.messages.find(
          (message) => message.isSummary,
        );
        const summaryDetails: SummaryDetails | null = summaryMessage
          ? {
              ...summaryMessage,
              documentName: session.title,
              docId: session.docId,
              createdAt: session.createdAt,
              summary: summaryMessage.content,
            }
          : null;

        setSummaryDetails(summaryDetails);
        // console.log(res.data.message);
        // TODO, handling for when gemini error timed out message
      } else {
        toast.error(res.data?.message || "Failed to fetch session");
      }
    } catch (error) {
      console.error(`Error creating/fetching session for doc ${docId}`, error);
      toast.error("Error while fetching session.");
    } finally {
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    if (docId) createOrFetchSession();
  }, [docId, createOrFetchSession]);

  return {
    session,
    summaryDetails,
    loading,
    refresh: () => docId && createOrFetchSession(),
  };
};
