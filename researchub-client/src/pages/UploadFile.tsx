// UploadFile.tsx
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import {
  SUPPORTED_ACCEPT,
  SUPPORTED_EXTENSIONS,
  useUploadFile,
} from "../hooks/useUploadFile";
import { useNavigate } from "react-router-dom";
import { uploadStyles } from "../assets/styles/UploadFile.styles";

const UploadFile = () => {
  const { handleFiles, uploadResponse, isLoading } = useUploadFile();
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
    <div style={uploadStyles.container}>
      <div style={uploadStyles.contentCard}>
        {/* Header Section */}
        <div style={uploadStyles.header}>
          <div style={uploadStyles.iconWrapper}>
            <svg
              style={uploadStyles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 style={uploadStyles.title}>Ask ResearchHub</h1>
          <p style={uploadStyles.subtitle}>
            Upload your documents and get instant AI-powered insights and
            answers
          </p>
        </div>

        {/* Drop Zone */}
        <div
          style={{
            ...uploadStyles.dropZone,
            ...(isDragOver ? uploadStyles.dropZoneDragOver : {}),
            ...(isLoading ? uploadStyles.dropZoneLoading : {}),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={SUPPORTED_ACCEPT}
            id="fileInput"
            style={uploadStyles.fileInput}
            onChange={handleFileSelect}
            disabled={isLoading}
          />

          {isLoading ? (
            <div style={uploadStyles.loadingState}>
              <div style={uploadStyles.spinner} />
              <p style={uploadStyles.loadingText}>
                Processing your document...
              </p>
            </div>
          ) : (
            <>
              <div style={uploadStyles.uploadIcon}>
                <svg
                  style={uploadStyles.uploadSvg}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <label htmlFor="fileInput" style={uploadStyles.fileLabel}>
                <span style={uploadStyles.labelPrimary}>Click to upload</span>
                <span style={uploadStyles.labelSecondary}>
                  or drag and drop
                </span>
              </label>
            </>
          )}
        </div>

        {/* Info Section */}
        <div style={uploadStyles.infoSection}>
          <div style={uploadStyles.infoItem}>
            <svg
              style={uploadStyles.infoIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span style={uploadStyles.infoText}>
              Supported:{" "}
              {SUPPORTED_EXTENSIONS.map((ext) =>
                ext.replace(".", "").toUpperCase()
              ).join(", ")}
            </span>
          </div>
          <div style={uploadStyles.infoItem}>
            <svg
              style={uploadStyles.infoIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span style={uploadStyles.infoText}>Maximum file size: 1GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
