import { useNavigate, useParams } from "react-router-dom";
import { useDocumentSummary } from "../hooks/useDocumentSummary";
import { useDocumentQuery } from "../hooks/useDocumentQuery";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "../assets/styles/Chat.css";
import { Badge } from "@/components/ui/badge";
import ReHypeRaw from "rehype-raw";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Citation } from "@/types/citations.types";
import { Headphones, Menu, X } from "lucide-react";
import { useAudioOverview } from "@/hooks/useAudioOverview";
import { CustomAudioPlayer } from "@/components/custom/CustomAudioPlayer";

const CHUNK_REGEX_PATTERN = /\[(CHUNK_\d+(?:\s*,\s*CHUNK_\d+)*)\]/g;

interface Message {
  sender: "user" | "bot";
  text: string;
  loading?: boolean;
}

export const MARKDOWN_MESSAGE_TYPE = {
  SUMMARY: "SUMMARY",
  ANSWER: "ANSWER",
} as const;

export type MarkdownMessageType =
  (typeof MARKDOWN_MESSAGE_TYPE)[keyof typeof MARKDOWN_MESSAGE_TYPE];

const Chat = () => {
  const { documentId = null } = useParams();
  const navigate = useNavigate();

  if (!documentId) navigate("/");

  const { summaryResponse, loading: documentSummaryLoader } =
    useDocumentSummary(documentId);
  const { queryResponse, askQuestion } = useDocumentQuery(documentId);
  const {
    audioUrl,
    loading: generateAudioOverviewLoader,
    generateAudio,
  } = useAudioOverview();

  const [messages, setMessages] = useState<Message[]>([]);
  const [showSummary, setShowSummary] = useState(true);
  const [selectedCitation, setSelectedCitation] = useState<
    Citation | null | undefined
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const addBadgeMarker = (
    text: string | undefined,
    textPosition: MarkdownMessageType,
  ) => {
    return text?.replace(CHUNK_REGEX_PATTERN, (match) => {
      const ids = [...match.matchAll(/CHUNK_(\d+)/g)].map((m) => m[1]);
      const uniqueIds = [...new Set(ids)];

      //skips citing the answer or summary when api does not return all citations
      if (textPosition === MARKDOWN_MESSAGE_TYPE.SUMMARY) {
        if (summaryResponse?.citations?.length !== uniqueIds.length)
          return text?.replace(CHUNK_REGEX_PATTERN, "");
      } else if (textPosition === MARKDOWN_MESSAGE_TYPE.ANSWER) {
        if (queryResponse?.citations?.length !== uniqueIds.length)
          return text?.replace(CHUNK_REGEX_PATTERN, "");
      }

      return ids
        .map((id) => `<citation data-chunk="${id}">${id}</citation>`)
        .join(" ");
    });
  };

  const handleGenerateAudioOverview = async () => {
    await generateAudio(documentId);
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
          (m) => m.sender === "bot" && m.loading,
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

  const renderMarkdown = (text: string, citations: Citation[] | undefined) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markdownComponents: any = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      citation: (props: any) => {
        const id = Number(props["data-chunk"]);

        const onClickCitation = () => {
          const citation = citations?.find(
            (c: Citation) => c.chunkIndex === id,
          );

          setSelectedCitation(citation || null);
        };

        return (
          <Badge
            className="inline-flex items-center justify-center h-5 min-w-5 rounded-full px-1 bg-indigo-50 text-indigo-600 border border-indigo-200 font-mono text-xs cursor-pointer"
            onClick={onClickCitation}
          >
            {props.children}
          </Badge>
        );
      },
    };

    return (
      <ReactMarkdown
        rehypePlugins={[ReHypeRaw]}
        components={markdownComponents}
      >
        {text}
      </ReactMarkdown>
    );
  };

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

      <div className="chat-wrapper">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } transition-all duration-300 border-r bg-muted/40 p-4 flex flex-col items-start justify-between sidebar-wrapper`}
        >
          <div className="flex flex-col gap-6 w-full">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-primary p-1 sidebar-button focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {sidebarOpen && (
              <div>
                <h2 className="text-sm font-medium tracking-wide mb-2 sidebar-heading">
                  Tools
                </h2>
                {summaryResponse?.audioOverviewUrl || audioUrl ? (
                  <CustomAudioPlayer
                    audioUrl={summaryResponse?.audioOverviewUrl || audioUrl}
                  />
                ) : generateAudioOverviewLoader ? (
                  <div className="chat-summary-loader">
                    <div className="chat-summary-spinner" />
                    <p className="chat-summary-loading-text">
                      Generating Audio Overview...
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateAudioOverview}
                    className="text-sm text-primary flex items-center gap-2 sidebar-button-2 focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent"
                  >
                    <Headphones size={32} />
                    Generate Audio Overview
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

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
                className="chat-toggle-button focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent"
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
                  {renderMarkdown(
                    addBadgeMarker(
                      summaryResponse?.summary,
                      MARKDOWN_MESSAGE_TYPE.SUMMARY,
                    ) || "No summary available",
                    summaryResponse?.citations,
                  )}
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
                  msg.sender === "user"
                    ? "chat-message-user"
                    : "chat-message-bot"
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
                        {renderMarkdown(
                          addBadgeMarker(
                            msg.text,
                            MARKDOWN_MESSAGE_TYPE.ANSWER,
                          ) || "No Response",
                          queryResponse?.citations,
                        )}
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

      {/* Citation Dialog */}
      <Dialog
        open={!!selectedCitation}
        onOpenChange={(open) => !open && setSelectedCitation(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 citation-wrapper">
          {selectedCitation && (
            <>
              {/* Header with gradient */}
              <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Citation Details
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Pages: {selectedCitation.pages.join(", ")}
                    </span>
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Scrollable Content with better styling */}
              <div className="px-6 py-6 overflow-y-auto flex-1 bg-white selected-citation-text">
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap m-0">
                      {selectedCitation.text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end items-center text-gray-800">
                {/* TODO Footer actions to open actual document view */}
                {/* <div className="text-xs text-gray-500">
                  Click "Go to Pages" to view in document
                </div> */}
                {summaryResponse?.documentName}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
