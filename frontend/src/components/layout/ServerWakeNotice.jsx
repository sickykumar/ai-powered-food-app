import React, { useState, useEffect } from "react";
import { subscribeServerWake } from "../../utils/api";
import "./ServerWakeNotice.css";

const ServerWakeNotice = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("waking"); // "waking" | "connected"
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let intervalId = null;
    let hideTimer = null;

    const unsubscribe = subscribeServerWake(({ isWaking, state }) => {
      if (isWaking) {
        setStatus("waking");
        setVisible(true);
        setElapsedSeconds(0);

        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      } else if (state === "connected") {
        setStatus("connected");
        if (intervalId) clearInterval(intervalId);

        // Auto hide 2.5s after connected
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          setVisible(false);
        }, 2500);
      } else {
        if (intervalId) clearInterval(intervalId);
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          setVisible(false);
        }, 3000);
      }
    });

    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="server-wake-portal" role="status" aria-live="polite">
      <div className={`server-wake-card ${status}`}>
        <div className="server-wake-glow-bar" />

        <div className="server-wake-header">
          <div className="server-wake-title-wrap">
            <div className="server-wake-icon-box">
              {status === "waking" ? (
                <>
                  <span>⚡</span>
                  <span className="pulse-ring" />
                </>
              ) : (
                <span>✓</span>
              )}
            </div>
            <div className="server-wake-title">
              {status === "waking"
                ? "Waking Cloud Server..."
                : "Server Connected!"}
            </div>
          </div>
          <button
            className="server-wake-close-btn"
            onClick={() => setVisible(false)}
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>

        <div className="server-wake-body">
          {status === "waking"
            ? "Free cloud instances spin down after inactivity. Server is booting up (~15-30s)..."
            : "Connection established successfully. Enjoy exploring delicious meals!"}
        </div>

        <div className="server-wake-footer">
          <div className="server-wake-badge">
            {status === "waking" ? "Free Tier Cloud" : "Online"}
          </div>
          {status === "waking" && (
            <div className="server-wake-timer">
              ⏱ {elapsedSeconds}s elapsed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerWakeNotice;
