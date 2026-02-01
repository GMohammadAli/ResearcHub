import { useState, useCallback } from "react";
import { toast } from "sonner";
import ApiService from "@/services/ApiService";

interface AudioResponse {
  success: boolean;
  message?: string;
  audioOverviewSecureUrl?: string | null;
}

export const useAudioOverview = () => {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = useCallback(async (docId: string | null) => {
    if (!docId) return;

    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await ApiService.post<AudioResponse>(
        `/chat/documents/${docId}/generate-audio-overview`,
      );

      if (res.status === 200 && res.data?.success) {
        setAudioUrl(res.data.audioOverviewSecureUrl || null);
        toast.success("🔊 Audio overview is ready!");
      } else {
        toast.error(res.data?.message || "Failed to generate audio overview.");
      }
    } catch (error) {
      console.error("Audio overview generation error:", error);
      toast.error("Something went wrong while generating audio.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    audioUrl,
    generateAudio,
  };
};
