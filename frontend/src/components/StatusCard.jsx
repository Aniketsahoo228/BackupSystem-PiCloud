import { useState, useEffect, useRef } from "react";

const toneConfig = {
  default: {
    bg: "#F1EFE8", border: "#B4B2A9", text: "#2C2C2A",
    muted: "#5F5E5A", glow: "rgba(136,135,128,0.15)",
    icon: "◈", accent: "#888780",
  },
  success: {
    bg: "#E1F5EE", border: "#5DCAA5", text: "#04342C",
    muted: "#0F6E56", glow: "rgba(29,158,117,0.15)",
    icon: "◉", accent: "#1D9E75",
  },
  warning: {
    bg: "#FAEEDA", border: "#EF9F27", text: "#412402",
    muted: "#854F0B", glow: "rgba(186,117,23,0.15)",
    icon: "◈", accent: "#BA7517",
  },
  danger: {
    bg: "#FCEBEB", border: "#F09595", text: "#501313",
    muted: "#A32D2D", glow: "rgba(226,75,74,0.15)",
    icon: "◉", accent: "#E24B4A",
  },
  info: {
    bg: "#E6F1FB", border: "#85B7EB", text: "#042C53",
    muted: "#185FA5", glow: "rgba(55,138,221,0.15)",
    icon: "◈", accent: "#378ADD",
  },
};

function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(null);
  const raf = useRef(null);

  useEffect(() => {
    const num = parseFloat(String(target).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) { setDisplay(target); return; }

    const prefix = String(target).match(/^[^0-9-]*/)?.[0] ?? "";
    const suffix = String(target).match(/[^0-9.]*$/)?.[0] ?? "";
    const isInt = Number.isInteger(num);
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = eased * num;
      setDisplay(`${prefix}${isInt ? Math.round(cur) : cur.toFixed(1)}${suffix}`);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    setDisplay(`${prefix}0${suffix}`);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return display ?? target;
}

export default function StatusCard({ label, value, tone = "default" }) {
  const cfg = toneConfig[tone] ?? toneConfig.default;
  const animated = useCountUp(value);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 14,
          padding: "18px 20px 16px",
          fontFamily: "var(--font-sans)",
          overflow: "hidden",
          cursor: "default",
          animation: "scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered ? `0 6px 24px ${cfg.glow}` : `0 2px 8px ${cfg.glow}`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          minWidth: 140,
        }}
      >
        {/* Shimmer bar on hover */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 14, pointerEvents: "none",
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)`,
          backgroundSize: "200% auto",
          animation: hovered ? "shimmer 0.6s linear" : "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }} />

        {/* Top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3, background: cfg.accent,
          borderRadius: "14px 14px 0 0",
          transform: mounted ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s",
        }} />

        {/* Label */}
        <span style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 500,
          color: cfg.muted,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 10, color: cfg.accent }}>{cfg.icon}</span>
          {label}
        </span>

        {/* Value */}
        <strong style={{
          display: "block",
          fontSize: 28,
          fontWeight: 500,
          color: cfg.text,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          transition: "opacity 0.3s",
        }}>
          {animated}
        </strong>

        {/* Tone badge */}
        <span style={{
          position: "absolute", bottom: 14, right: 14,
          fontSize: 10, fontWeight: 500,
          color: cfg.muted,
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {tone}
        </span>
      </article>
    </>
  );
}
