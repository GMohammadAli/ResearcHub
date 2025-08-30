import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import {
  SUPPORTED_ACCEPT,
  SUPPORTED_EXTENSIONS,
  useUploadFile,
} from "../hooks/useUploadFile";
import ContentWrapper from "../components/ContentWrapper";
import { useNavigate } from "react-router-dom";

const UploadFile = () => {
  const { handleFiles, uploadResponse } = useUploadFile();

  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  useEffect(() => {
    if (uploadResponse?.success) navigate(`/chat/${uploadResponse.documentId}`);
  }, [uploadResponse, navigate]);

  return (
    <ContentWrapper>
      <div className="upload-file-container">
        <h1>Ask ResearcHub</h1>
        <p>
          Easily upload PDFs, docs, or text files, and get AI-powered answers to
          your questions.
        </p>

        <div
          id={`dropZone ${isDragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="upload-box"
        >
          <input
            type="file"
            accept={`${SUPPORTED_ACCEPT}`}
            id="fileInput"
            className="file-input"
            onChange={handleFileSelect}
          />
          <label htmlFor="fileInput" className="file-label">
            + Choose File
          </label>
        </div>
        <div className="info">
          Max file size 1GB. Please upload files of type:{" "}
          {SUPPORTED_EXTENSIONS.map((ext) =>
            ext.replace(".", "").toUpperCase()
          ).join(", ")}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default UploadFile;
