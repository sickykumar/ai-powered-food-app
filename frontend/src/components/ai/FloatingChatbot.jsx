import React, { useState, useEffect, useRef } from "react";
import AiFoodChatbot from "./AiFoodChatbot";
import "./FloatingChatbot.css";

/**
 * Floating AI Chatbot Widget
 * - Bottom-left animated fab button with pulsing AI glow
 * - Click to open chatbot panel overlay
 * - Click outside panel to close
 */
const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const fabRef = useRef(null);

  // Close on click outside the panel (but not the fab itself)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        fabRef.current &&
        !fabRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    // Small delay to prevent the opening click from immediately closing
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      {/* Floating AI Button */}
      <button
        ref={fabRef}
        type="button"
        className={`floating-ai-fab ${isOpen ? "fab-active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI Chef Chat" : "Open AI Chef Chat"}
        title="Chef Lumina AI"
      >
        <span className="fab-glow-ring" />
        <span className="fab-glow-ring fab-glow-ring-2" />
        <span className="fab-icon-wrap">
          {isOpen ? "✕" : "👨‍🍳"}
        </span>
        {!isOpen && <span className="fab-label-tooltip">Ask Chef Lumina</span>}
      </button>

      {/* Overlay backdrop (subtle dark) */}
      {isOpen && (
        <div
          className="floating-chat-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chatbot Panel */}
      <div
        ref={panelRef}
        className={`floating-chat-panel ${isOpen ? "panel-open" : "panel-closed"}`}
      >
        {isOpen && <AiFoodChatbot />}
      </div>
    </>
  );
};

export default FloatingChatbot;
