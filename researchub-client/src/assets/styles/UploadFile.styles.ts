import { CSSProperties } from "react";

export const uploadStyles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  contentCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "48px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  iconWrapper: {
    display: "inline-flex",
    padding: "16px",
    backgroundColor: "#f0f4ff",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  icon: {
    width: "40px",
    height: "40px",
    color: "#667eea",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 12px 0",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "16px",
    color: "#718096",
    margin: 0,
    lineHeight: "1.6",
  },
  dropZone: {
    border: "3px dashed #cbd5e0",
    borderRadius: "16px",
    padding: "60px 40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#f7fafc",
    position: "relative",
  },
  dropZoneDragOver: {
    borderColor: "#667eea",
    backgroundColor: "#f0f4ff",
    transform: "scale(1.02)",
  },
  dropZoneLoading: {
    borderColor: "#a0aec0",
    backgroundColor: "#edf2f7",
    cursor: "not-allowed",
  },
  fileInput: {
    display: "none",
  },
  uploadIcon: {
    marginBottom: "16px",
  },
  uploadSvg: {
    width: "64px",
    height: "64px",
    color: "#a0aec0",
    margin: "0 auto",
  },
  fileLabel: {
    display: "block",
    cursor: "pointer",
  },
  labelPrimary: {
    display: "block",
    fontSize: "18px",
    fontWeight: "600",
    color: "#667eea",
    marginBottom: "4px",
  },
  labelSecondary: {
    display: "block",
    fontSize: "14px",
    color: "#a0aec0",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "16px",
    color: "#718096",
    fontWeight: "500",
    margin: 0,
  },
  infoSection: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f7fafc",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  infoIcon: {
    width: "20px",
    height: "20px",
    color: "#667eea",
    flexShrink: 0,
  },
  infoText: {
    fontSize: "14px",
    color: "#4a5568",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
