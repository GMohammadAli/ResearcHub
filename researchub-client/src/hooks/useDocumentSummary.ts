import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import ApiService from "../services/ApiService";
import { Citation } from "@/types/citations.types";

interface SummaryResponse {
  success: boolean;
  documentName?: string;
  citations?: Citation[];
  summary?: string;
  message?: string;
  audioOverviewUrl?: string | null;
}

export const useDocumentSummary = (docId: string | null) => {
  const [summaryResponse, setSummaryResponse] =
    useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSummary = useCallback(async (id: string) => {
    setLoading(true);
    setSummaryResponse(null);
    try {
      const res = await ApiService.get<SummaryResponse>(
        `/chat/documents/${id}/summary`,
      );
      if (res.status === 200) {
        setSummaryResponse({
          success: true,
          summary: res.data?.summary || "",
          citations: res.data?.citations || [],
          documentName: res.data?.documentName || "",
          message: res.data?.message || "Summary fetched successfully",
          audioOverviewUrl: res.data?.audioOverviewUrl || null,
        });
        toast.success("🎉 Your summary is ready!");
      } else {
        setSummaryResponse({ success: false });
        toast.error(res.data?.message || "Failed to fetch summary");
      }
    } catch (error) {
      console.error(`Error fetching summary for document: ${id}`, error);
      setSummaryResponse({ success: false });
      toast.error("Error while fetching summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (docId) fetchSummary(docId);
  }, [docId, fetchSummary]);

  return {
    summaryResponse,
    loading,
    refresh: () => docId && fetchSummary(docId),
  };
};
