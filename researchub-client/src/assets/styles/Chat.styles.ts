import { CSSProperties } from "react";

export const chatStyles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "16px 24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  brandIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#667eea",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandSvg: {
    width: "28px",
    height: "28px",
    color: "white",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a202c",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#718096",
    margin: "2px 0 0 0",
  },
  newChatButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  buttonIcon: {
    width: "18px",
    height: "18px",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "24px",
    gap: "20px",
    overflow: "hidden",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  summaryExpanded: {
    padding: "24px",
    maxHeight: "800px",
    opacity: 1,
  },
  summaryCollapsed: {
    padding: "24px 24px 0 24px",
    maxHeight: "76px",
    opacity: 1,
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  summaryTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  summaryIcon: {
    width: "24px",
    height: "24px",
    color: "#667eea",
  },
  summaryTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a202c",
    margin: 0,
  },
  toggleButton: {
    width: "32px",
    height: "32px",
    border: "none",
    background: "#f0f4ff",
    color: "#667eea",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  chevronIcon: {
    width: "20px",
    height: "20px",
    transition: "transform 0.3s ease",
  },
  summaryContent: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#4a5568",
  },
  summaryLoader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "20px",
  },
  summarySpinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  summaryLoadingText: {
    fontSize: "14px",
    color: "#718096",
    margin: 0,
  },
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  welcomeMessage: {
    textAlign: "center",
    padding: "60px 20px",
  },
  welcomeIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  welcomeTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a202c",
    margin: "0 0 8px 0",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#718096",
    margin: 0,
  },
  messageWrapper: {
    display: "flex",
    gap: "12px",
    maxWidth: "80%",
  },
  userMessageWrapper: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botMessageWrapper: {
    alignSelf: "flex-start",
  },
  botAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#f0f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarIcon: {
    width: "20px",
    height: "20px",
    color: "#667eea",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "16px",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  userMessage: {
    backgroundColor: "#667eea",
    color: "white",
    borderBottomRightRadius: "4px",
  },
  botMessage: {
    backgroundColor: "#f7fafc",
    color: "#2d3748",
    borderBottomLeftRadius: "4px",
  },
  markdownContent: {
    color: "#2d3748",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    padding: "4px 0",
  },
  typingDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#a0aec0",
    borderRadius: "50%",
    animation: "bounce 1.4s infinite ease-in-out",
  },
  inputContainer: {
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  inputWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  sendButton: {
    width: "48px",
    height: "48px",
    backgroundColor: "#667eea",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  sendIcon: {
    width: "22px",
    height: "22px",
    color: "white",
  },
};

// Add animations
const chatStyleSheet = document.createElement("style");
chatStyleSheet.textContent = `
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;
document.head.appendChild(chatStyleSheet);
