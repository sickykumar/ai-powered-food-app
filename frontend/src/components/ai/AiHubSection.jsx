import React from "react";
import AiAutoScrollFeed from "./AiAutoScrollFeed";
import "./AiHub.css";

/**
 * Full-Width AI Hub Section
 * Auto-scrolling dynamic live recommendations & smart food pairings.
 * Chatbot is now a global floating widget (see FloatingChatbot).
 */
const AiHubSection = ({ dishes = [] }) => {
  return (
    <section className="ai-hub-section my-5">
      {/* Section Header */}
      <div className="text-center mb-4">
        <span className="ai-section-pill">⚡ NEXT-GEN INTELLIGENCE</span>
        <h2 className="ai-hub-heading mt-2">AI Culinary Intelligence Hub</h2>
        <p className="ai-hub-subheading">
          Real-time smart food pairings, algorithmic taste matches & live nutrition intelligence stream.
        </p>
      </div>

      <div className="ai-hub-grid">
        <AiAutoScrollFeed dishes={dishes} />
      </div>
    </section>
  );
};

export default AiHubSection;
