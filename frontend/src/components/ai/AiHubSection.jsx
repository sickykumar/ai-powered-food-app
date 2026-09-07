import React from "react";
import AiAutoScrollFeed from "./AiAutoScrollFeed";
import AiFoodChatbot from "./AiFoodChatbot";
import "./AiHub.css";

/**
 * Split-Screen AI Hub Section
 * Left side: Auto-scrolling dynamic live recommendations & smart food pairings.
 * Right side: Interactive Chef Lumina AI Food Chatbot.
 */
const AiHubSection = ({ dishes = [] }) => {
  return (
    <section className="ai-hub-section my-5">
      {/* Section Header */}
      <div className="text-center mb-4">
        <span className="ai-section-pill">⚡ NEXT-GEN INTELLIGENCE</span>
        <h2 className="ai-hub-heading mt-2">AI Culinary Intelligence Hub</h2>
        <p className="ai-hub-subheading">
          Real-time smart food pairings on the left, your personal AI Chef Sommelier on the right.
        </p>
      </div>

      <div className="row g-4 ai-hub-grid">
        {/* Left Side: Auto-scrolling live recommendations */}
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          <AiAutoScrollFeed dishes={dishes} />
        </div>

        {/* Right Side: Interactive AI Food Chatbot */}
        <div className="col-12 col-lg-6">
          <AiFoodChatbot />
        </div>
      </div>
    </section>
  );
};

export default AiHubSection;
