import React from "react";
import { DEFAULT_AVATARS } from "../../utils/defaultAvatars";

/**
 * 5 Top Preset Avatars Selector (Male & Female Foodies & Chefs + AI Mascot)
 */
const AvatarPresetSelector = ({ selectedUrl, onSelect }) => {
  return (
    <div className="avatar-preset-selector">
      <div className="avatar-preset-header">
        <span className="avatar-preset-title">
          <span>✨ Choose a Default Avatar</span>
        </span>
        <span className="avatar-preset-badge">Male & Female</span>
      </div>

      <div className="avatar-preset-grid">
        {DEFAULT_AVATARS.map((avatar) => {
          const isSelected = selectedUrl === avatar.url;

          return (
            <div
              key={avatar.id}
              className={`avatar-preset-card ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(avatar.url)}
              title={`${avatar.name} (${avatar.gender} - ${avatar.role})`}
            >
              {isSelected && <span className="avatar-preset-check">✓</span>}
              <img
                src={avatar.url}
                alt={avatar.name}
                className="avatar-preset-img"
              />
              <span className="avatar-preset-name">{avatar.name}</span>
              <span className="avatar-preset-gender">{avatar.badge}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPresetSelector;
