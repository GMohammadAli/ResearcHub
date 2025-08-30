import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiService from "../services/ApiService";

export const SUPPORTED_MIME_TYPES = [
  "application/pdf", // PDF
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/msword", // DOC
  "text/plain", // TXT
];

export const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];

export const SUPPORTED_ACCEPT: string = [
  ...SUPPORTED_MIME_TYPES,
  ...SUPPORTED_EXTENSIONS,
].join(",");

interface UploadResponse {
  success: boolean;
  documentId?: string;
  message?: string;
}

export const useUploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );

  const validateFile = (file: File): boolean => {
    const isValidMime = SUPPORTED_MIME_TYPES.includes(file.type);
    const isValidExt = SUPPORTED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    return isValidMime || isValidExt;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) {
      toast.error(
        `Unsupported file type. Please upload ${SUPPORTED_EXTENSIONS.map(
          (ext) => ext.replace(".", "").toUpperCase()
        ).join()}.`
      );
      setFile(null);
      return;
    }

    setFile(file);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    handleFile(files[0]); // handling only first file for now
  };

  const uploadFile = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("document", file);
      const res = await ApiService.post<UploadResponse>(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 201) {
        setUploadResponse({
          success: true,
          documentId: res.data?.documentId || "",
          message: res.data?.message || "File uploaded successfully",
        });
      } else setUploadResponse({ success: false });
    } catch (error) {
      console.error(
        `Error while upload file: ${file.name}, ${file.type}, ${file.size}`,
        error
      );
      toast.error(`Error while uploading file: ${file.name}`);
    } finally {
      reset();
    }
  }, []);

  const reset = () => {
    setFile(null);
  };

  useEffect(() => {
    if (file) uploadFile(file);
  }, [file, uploadFile]);

  return {
    uploadResponse,
    file,
    handleFiles,
  };
};
