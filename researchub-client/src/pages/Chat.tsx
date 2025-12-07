import { useNavigate, useParams } from "react-router-dom";
import { useDocumentSummary } from "../hooks/useDocumentSummary";
import { useDocumentQuery } from "../hooks/useDocumentQuery";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "../assets/styles/Chat.css";

interface Message {
  sender: "user" | "bot";
  text: string;
  loading?: boolean;
}

const Chat = () => {
  const { documentId = null } = useParams();
  const navigate = useNavigate();

  if (!documentId) navigate("/");

  const { summaryResponse, loading: documentSummaryLoader } =
    useDocumentSummary(documentId);
  const { queryResponse, askQuestion } = useDocumentQuery(documentId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [showSummary, setShowSummary] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const input = inputRef.current;
    if (!input || input.value.trim() === "") return;

    const userText = input.value;

    // Collapse summary when user sends first message
    if (messages.length === 0) {
      setShowSummary(false);
    }

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      { sender: "bot", text: "", loading: true },
    ]);

    askQuestion(userText);
    input.value = "";
  };

  useEffect(() => {
    if (chatRef.current) {
      // Add a small delay for smooth scrolling with large messages
      setTimeout(() => {
        chatRef.current!.scrollTo({
          top: chatRef.current!.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (queryResponse?.success) {
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.findIndex(
          (m) => m.sender === "bot" && m.loading
        );

        if (lastIndex !== -1) {
          updated[lastIndex] = {
            sender: "bot",
            text: `${queryResponse?.answer}`,
            loading: false,
          };
        } else {
          updated.push({ sender: "bot", text: `${queryResponse?.answer}` });
        }

        return updated;
      });
    }
  }, [queryResponse]);

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-left">
            <div className="chat-brand-icon">
              <svg
                className="chat-brand-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="chat-header-title">ResearcHub - Document Chat</h2>
              <p className="chat-header-subtitle">
                AI-powered document assistant
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="chat-new-button">
            <svg
              className="chat-button-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Document
          </button>
        </div>
      </div>

      <div className="chat-main">
        {/* Summary Card */}
        <div
          className={`chat-summary-card ${
            showSummary ? "chat-summary-expanded" : "chat-summary-collapsed"
          }`}
        >
          <div className="chat-summary-header">
            <div className="chat-summary-title-row">
              <svg
                className="chat-summary-icon"
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
              <h3 className="chat-summary-title">Document Summary</h3>
            </div>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="chat-toggle-button"
              aria-label={showSummary ? "Collapse summary" : "Expand summary"}
            >
              <svg
                className={`chat-chevron ${
                  showSummary ? "rotate-180" : "no-rotate"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          {showSummary &&
            (documentSummaryLoader ? (
              <div className="chat-summary-loader">
                <div className="chat-summary-spinner" />
                <p className="chat-summary-loading-text">
                  Generating summary...
                </p>
              </div>
            ) : (
              <div className="chat-summary-content">
                <ReactMarkdown>
                  {summaryResponse?.summary || "No summary available"}
                </ReactMarkdown>
              </div>
            ))}
        </div>

        {/* Chat Messages */}
        <div className="chat-messages" ref={chatRef}>
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">👋</div>
              <h3 className="chat-welcome-title">Hi there!</h3>
              <p className="chat-welcome-text">
                I've analyzed your document. Ask me anything about it!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message-wrapper ${
                msg.sender === "user" ? "chat-message-user" : "chat-message-bot"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="chat-bot-avatar">
                  <svg
                    className="chat-avatar-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`chat-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.sender === "bot" ? (
                  msg.loading ? (
                    <div className="chat-typing">
                      <span className="chat-typing-dot" />
                      <span
                        className="chat-typing-dot"
                        style={{
                          animationDelay: "0.2s",
                        }}
                      />
                      <span
                        className="chat-typing-dot"
                        style={{
                          animationDelay: "0.4s",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="chat-markdown">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              type="text"
              ref={inputRef}
              placeholder="Ask a question about your document..."
              className="chat-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="chat-send-button"
              title="Send Message"
            >
              <svg
                className="chat-send-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
