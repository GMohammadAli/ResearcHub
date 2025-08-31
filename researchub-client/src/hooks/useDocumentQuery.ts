import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import ApiService from "../services/ApiService";

interface QueryResponse {
  success: boolean;
  answer?: string;
  message?: string;
}

export const useDocumentQuery = (docId: string | null) => {
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const askQuestion = useCallback(
    async (question: string) => {
      if (!docId || !question) return;
      setLoading(true);
      setQueryResponse(null);
      try {
        const res = await ApiService.get<QueryResponse>(
          `/documents/${docId}/?question=${encodeURIComponent(question)}`
        );
        if (res.status === 200 && res.data?.success) {
          setQueryResponse({
            success: true,
            answer: res.data?.answer || "",
            message: res.data?.message || "Query fetched successfully",
          });
        } else {
          setQueryResponse({ success: false });
          toast.error(res.data?.message || "Failed to fetch Query");
        }
      } catch (error) {
        console.error(
          `Error fetching Query for ${docId} question: ${question}`,
          error
        );
        setQueryResponse({ success: false });
        toast.error("Error while fetching answer.");
      } finally {
        setLoading(false);
      }
    },
    [docId]
  );

  return {
    queryResponse,
    loading,
    askQuestion,
  };
};
