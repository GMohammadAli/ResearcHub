import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "../components/ContentWrapper";
import { useDocumentSummary } from "../hooks/useDocumentSummary";
import { useDocumentQuery } from "../hooks/useDocumentQuery";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chat = () => {
  const { documentId = null } = useParams();
  const navigate = useNavigate();

  if (!documentId) navigate("/");

  const { summaryResponse } = useDocumentSummary(documentId);
  const { queryResponse, askQuestion } = useDocumentQuery(documentId);

  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const input = inputRef.current;
    if (!input || input.value.trim() === "") return;

    const userText = input.value;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    askQuestion(userText);

    // Clear input
    input.value = "";
  };

  useEffect(() => {
    if (chatRef.current) {
      requestAnimationFrame(() => {
        chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
      });
    }
  }, [messages]);

  useEffect(() => {
    if (queryResponse?.success) {
      // Add bot reply
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `${queryResponse?.answer}` },
      ]);
    }
  }, [queryResponse]);

  return (
    <ContentWrapper containerClass="chat-with-doc-container">
      <div className="summary-card">
        <h3>📄 Document Summary</h3>
        <p>{summaryResponse?.summary}</p>
      </div>

      <div className="chat-container" id="chat" ref={chatRef}>
        <div className="message bot">
          👋 Hi! Ask me anything about your document.
        </div>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <pre>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </pre>
            ) : (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            )}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          id="userInput"
          ref={inputRef}
          placeholder="Type your message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // prevents newline
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </ContentWrapper>
  );
};

export default Chat;
