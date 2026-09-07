import React, { useState } from "react";
import "./AiOrb.css";

const AiOrbVisualizer = ({ onOpenChat }) => {
  const [pulseActive, setPulseActive] = useState(false);

  const handleOrbClick = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 800);
    if (onOpenChat) {
      onOpenChat();
    } else {
      // Smoothly focus or bring the chatbot into view
      const chatInput = document.getElementById("ai-chat-input-field");
      if (chatInput) {
        chatInput.focus();
        chatInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="ai-orb-container">
      {/* Background Ambient Glow */}
      <div className="ai-orb-ambient-glow" />

      {/* Top Status Header */}
      <div className="ai-orb-header">
        <div className="ai-orb-title-box">
          <span style={{ fontSize: "1.25rem" }}>🤖</span>
          <h3 className="ai-orb-title">Neural Culinary Core</h3>
        </div>
        <span className="ai-orb-badge">
          <span className="ai-orb-badge-dot" />
          AI ONLINE
        </span>
      </div>

      {/* 3D Round Animated Sphere Stage (Goal Animation) */}
      <div
        className={`ai-orb-stage ${pulseActive ? "orb-clicked" : ""}`}
        onClick={handleOrbClick}
        title="Click to activate Chef Lumina AI Assistant"
      >
        {/* Concentric Gyroscopic Rings */}
        <div className="orb-ring-1" />
        <div className="orb-ring-2" />
        <div className="orb-ring-3" />

        {/* The Core Glowing Sphere (Goal / Round Orb) */}
        <div className="ai-core-sphere">
          <span className="ai-sphere-symbol">👨‍🍳</span>
        </div>

        {/* Floating Sensory Chips */}
        <div className="orb-satellite-chip chip-top-left">
          ⚡ 99.8% Taste Match
        </div>
        <div className="orb-satellite-chip chip-bottom-right">
          🍲 LLaMA 3.1 Sommelier
        </div>
      </div>

      {/* Dynamic Soundwave / Brainwave Bars */}
      <div className="ai-wave-container">
        <div className="ai-wave-bar" />
        <div className="ai-wave-bar" />
        <div className="ai-wave-bar" />
        <div className="ai-wave-bar" />
        <div className="ai-wave-bar" />
        <div className="ai-wave-bar" />
        <div className="ai-wave-bar" />
      </div>

      {/* Footer Controls & Direct Launch Button */}
      <div className="ai-orb-footer">
        <p className="ai-orb-subtitle">
          Tap the AI Core to launch your personal Chef Lumina Sommelier
        </p>
        <div className="ai-orb-prompt-tags">
          <button
            type="button"
            className="ai-orb-tag-btn"
            onClick={handleOrbClick}
          >
            ✨ Launch AI Assistant →
          </button>
          <button
            type="button"
            className="ai-orb-tag-btn"
            onClick={() => {
              handleOrbClick();
              const chatInput = document.getElementById("ai-chat-input-field");
              if (chatInput) chatInput.value = "What is the best biryani pair?";
            }}
          >
            🔥 Best Biryani Pairing
          </button>
          <button
            type="button"
            className="ai-orb-tag-btn"
            onClick={() => {
              handleOrbClick();
              const chatInput = document.getElementById("ai-chat-input-field");
              if (chatInput) chatInput.value = "Show high protein keto meal";
            }}
          >
            🥗 High Protein Diet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiOrbVisualizer;
