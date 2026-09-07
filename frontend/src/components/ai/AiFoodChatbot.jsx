import React, { useState, useRef, useEffect } from "react";
import api from "../../utils/api";
import "./AiHub.css";

const QUICK_PROMPTS = [
  "💪 High Protein under 400 kcal",
  "🌱 Pure Veg spicy dinner",
  "💰 Best combo under ₹200",
  "🍕 Late night quick cravings",
];

// Clean & format text for human-friendly luxury reading with zero raw markdown symbols
const renderFormattedMessage = (rawText) => {
  if (!rawText) return null;

  // Strip all asterisks, markdown headers, and raw formatting symbols
  const cleaned = rawText
    .replace(/\*\*/g, "") // remove bold asterisks
    .replace(/\*/g, "")   // remove italic / bullet asterisks
    .replace(/^#+\s*/gm, "") // remove markdown #
    .replace(/_{1,2}/g, "") // remove underscores
    .replace(/`{1,3}/g, ""); // remove backticks

  const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <div className="ai-formatted-chat">
      {lines.map((line, idx) => {
        // Check if line is a bullet item
        const isBullet = /^[•\-+]\s+/.test(line) || /^\d+\.\s+/.test(line);
        const textContent = line.replace(/^[•\-+]\s+/, "").replace(/^\d+\.\s+/, "");

        // Check if line is a tip or callout
        const isTip =
          textContent.toLowerCase().startsWith("pro tip:") ||
          textContent.toLowerCase().startsWith("pro-tip:");

        // Check if line is a section header (e.g. "Chef Lumina Recommends:", "Top Vegetarian Delicacies Today:")
        const isHeader =
          !isBullet &&
          (textContent.endsWith(":") ||
            textContent.includes("Recommends:") ||
            textContent.includes("Picks:") ||
            textContent.includes("Feasts:"));

        if (isTip) {
          return (
            <div key={idx} className="ai-chat-tip-box my-2">
              <span className="ai-tip-badge">💡 PRO TIP</span>
              <p className="m-0 mt-1">{textContent.replace(/^pro\s*tip:\s*/i, "")}</p>
            </div>
          );
        }

        if (isHeader) {
          return (
            <div key={idx} className="ai-chat-header-line my-2">
              <span className="ai-chat-header-pill">{textContent}</span>
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={idx} className="ai-chat-bullet-item d-flex align-items-start gap-2 mb-1">
              <span className="ai-chat-bullet-icon">✦</span>
              <span className="ai-chat-bullet-text">{textContent}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="ai-chat-paragraph mb-2">
            {textContent}
          </p>
        );
      })}
    </div>
  );
};

const AiFoodChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "👋 Bonjour! I'm Chef Lumina, your AI Sommelier & Nutrition Assistant. What are you craving today, or what is your dietary goal?",
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const nextMsgId = useRef(2);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (customText) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isTyping) return;

    nextMsgId.current += 1;
    const userMessage = {
      id: nextMsgId.current,
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputText("");
    setIsTyping(true);

    try {
      const response = await api.post("/v1/ai/chat", {
        message: textToSend,
        history: messages.slice(-4),
      });

      const aiReply = response.data?.data?.reply || "I recommend trying our Chef Special Dum Biryani or Paneer Tikka!";

      nextMsgId.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId.current,
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.warn("Chatbot API fallback:", err);
      nextMsgId.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId.current,
          sender: "ai",
          text: "✨ Chef Lumina Recommends:\n• Butter Chicken / Paneer Makhani with Garlic Naan\n• Crispy Corn Pepper Fry\n• Chilled Mango Lassi\n\nEnjoy fresh from our top-rated gourmet kitchens!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chatbot-container">
      {/* Bot Header */}
      <div className="ai-chat-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="ai-avatar-badge">
            <span className="ai-avatar-icon">👨‍🍳</span>
            <span className="ai-avatar-status" />
          </div>
          <div>
            <h5 className="m-0 ai-bot-name">Chef Lumina AI</h5>
            <small className="ai-bot-role">Culinary Sommelier • Powered by LLaMA 3.1</small>
          </div>
        </div>
        <span className="ai-online-badge">⚡ Instant</span>
      </div>

      {/* Quick Prompt Chips */}
      <div className="ai-prompt-chips d-flex gap-2 p-2">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            className="ai-chip-btn"
            onClick={() => handleSendMessage(prompt)}
            disabled={isTyping}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="ai-messages-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ai-message-bubble ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
          >
            {msg.sender === "ai" && <span className="bot-tag-label">Chef Lumina</span>}
            <div className="ai-message-content">
              {renderFormattedMessage(msg.text)}
            </div>
            <span className="ai-message-time">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="ai-message-bubble bot-msg typing-bubble">
            <div className="typing-dots">
              <span />
              <span />
              <span />
            </div>
            <small className="text-muted ml-2">Chef Lumina is crafting recommendations...</small>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="ai-chat-input-row d-flex align-items-center gap-2">
        <input
          type="text"
          className="ai-input-field form-control"
          placeholder="Ask anything: e.g. 'Healthy lunch under 300'..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button
          className="ai-send-btn"
          onClick={() => handleSendMessage()}
          disabled={isTyping || !inputText.trim()}
          aria-label="Send Message"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default AiFoodChatbot;
