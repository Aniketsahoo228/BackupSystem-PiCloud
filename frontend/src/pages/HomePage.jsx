import { useState, useEffect } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, d2, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
);
const ArrowRight  = () => <Icon d="M5 12h14M12 5l7 7-7 7" />;
const ShieldIcon  = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const UploadIcon  = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const DatabaseIcon= () => <Icon d="M12 2C6.48 2 2 4.24 2 7s4.48 5 10 5 10-2.24 10-5-4.48-5-10-5z" d2="M2 17c0 2.76 4.48 5 10 5s10-2.24 10-5M2 12c0 2.76 4.48 5 10 5s10-2.24 10-5" />;
const CodeIcon    = () => <Icon d="M16 18l6-6-6-6M8 6l-6 6 6 6" />;
const ServerIcon  = () => <Icon d="M2 9h20M2 15h20" d2="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />;
const RefreshIcon = () => <Icon d="M23 4v6h-6M1 20v-6h6" d2="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />;
const ChevronIcon = () => <Icon d="M9 18l6-6-6-6" />;
const CheckIcon   = () => <Icon d="M20 6L9 17l-5-5" />;

// ── Tones ────────────────────────────────────────────────────────────────────
const tones = {
  default: { bg:"#F1EFE8", border:"#B4B2A9", text:"#2C2C2A", muted:"#5F5E5A", accent:"#888780", glow:"rgba(136,135,128,0.12)" },
  success: { bg:"#E1F5EE", border:"#5DCAA5", text:"#04342C", muted:"#0F6E56", accent:"#1D9E75", glow:"rgba(29,158,117,0.12)" },
  accent:  { bg:"#E6F1FB", border:"#85B7EB", text:"#042C53", muted:"#185FA5", accent:"#378ADD", glow:"rgba(55,138,221,0.12)" },
};

// ── StatusCard ───────────────────────────────────────────────────────────────
function StatusCard({ label, value, tone = "default", icon, delay = 0 }) {
  const c = tones[tone] ?? tones.default;
  const [hovered, setHovered] = useState(false);
  return (
    <article onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative", background:c.bg, border:`1px solid ${c.border}`,
        borderRadius:14, padding:"16px 18px 14px", overflow:"hidden", cursor:"default",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 10px 28px ${c.glow}` : `0 2px 8px ${c.glow}`,
        transition:"transform 0.22s ease, box-shadow 0.22s ease",
        animation:`cardIn 0.5s cubic-bezier(0.34,1.4,0.64,1) ${delay}s both`,
      }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
        background:c.accent, borderRadius:"14px 14px 0 0" }} />
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:500,
        color:c.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
        {icon && <span style={{ color:c.accent }}>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize:18, fontWeight:500, color:c.text, lineHeight:1.25 }}>{value}</div>
    </article>
  );
}

// ── Feature item ─────────────────────────────────────────────────────────────
function Feature({ text, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <li style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"7px 0",
      borderBottom:"0.5px solid var(--color-border-tertiary)",
      opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-8px)",
      transition:"opacity 0.35s ease, transform 0.35s ease", listStyle:"none" }}>
      <span style={{ marginTop:1, color:"#1D9E75", flexShrink:0 }}><CheckIcon /></span>
      <span style={{ fontSize:13, color:"var(--color-text-secondary)", lineHeight:1.55 }}>{text}</span>
    </li>
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const dur = 1200, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{val}{suffix}</>;
}

// ── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage({ onOpenDashboard }) {
  const [btnHovered, setBtnHovered] = useState(false);
  const [secHovered, setSecHovered] = useState(null);

  const frontendFeatures = [
    "Landing page to explain private cloud backup",
    "Dashboard for upload and file monitoring",
    "Recovery page for backup copy inspection",
  ];
  const backendFeatures = [
    "Authentication with device_id and PIN",
    "File compression, encryption, and storage",
    "Metadata listing, download, sync, and recovery APIs",
  ];

  const sections = [
    { key:"frontend", icon:<CodeIcon />, accent:"#378ADD", bg:"#E6F1FB", label:"Frontend Pages", items: frontendFeatures },
    { key:"backend",  icon:<ServerIcon />, accent:"#1D9E75", bg:"#E1F5EE", label:"Backend Responsibilities", items: backendFeatures },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn  { from{opacity:0;transform:scale(0.93) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:820,
        margin:"0 auto", padding:"28px 16px", fontFamily:"var(--font-sans)" }}>

        {/* ── Hero ── */}
        <section style={{
          position:"relative", background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-tertiary)", borderRadius:18,
          padding:"40px 36px 36px", overflow:"hidden",
          animation:"fadeUp 0.4s cubic-bezier(0.34,1.2,0.64,1) both",
        }}>
          {/* Background grid decoration */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.03,
            backgroundImage:"linear-gradient(var(--color-text-primary) 1px,transparent 1px),linear-gradient(90deg,var(--color-text-primary) 1px,transparent 1px)",
            backgroundSize:"32px 32px" }} />

          {/* Floating orb */}
          <div style={{ position:"absolute", top:24, right:32, width:64, height:64,
            borderRadius:"50%", background:"#E6F1FB", border:"1px solid #B5D4F4",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#185FA5", animation:"floatY 3.5s ease-in-out infinite" }}>
            <ShieldIcon />
          </div>

          <div style={{ position:"relative" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6,
              fontSize:11, fontWeight:500, color:"#185FA5", textTransform:"uppercase",
              letterSpacing:"0.1em", marginBottom:14, padding:"4px 10px",
              background:"#E6F1FB", border:"0.5px solid #B5D4F4", borderRadius:20 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"#378ADD",
                animation:"pulse 2s ease-in-out infinite", display:"inline-block" }} />
              User Interaction Module
            </div>

            <h2 style={{ margin:"0 0 14px", fontSize:28, fontWeight:500, lineHeight:1.25,
              color:"var(--color-text-primary)", maxWidth:500 }}>
              Secure, private cloud backup at your fingertips
            </h2>

            <p style={{ margin:"0 0 28px", fontSize:14, color:"var(--color-text-secondary)",
              lineHeight:1.7, maxWidth:520 }}>
              PiCloud lets you back up your files with complete control. Upload encrypted backups from any device,
              monitor storage status in real-time, and restore files whenever needed — all on your own infrastructure.
              No third-party vendors. No data tracking. Complete privacy.
            </p>

            {/* Stats row */}
            <div style={{ display:"flex", gap:24, marginBottom:28 }}>
              {[
                { val:3, suffix:" pages",   label:"Ready-made" },
                { val:100, suffix:"% local", label:"Privacy first" },
                { val:0, suffix:" deps",    label:"External UI libs" },
              ].map(({ val, suffix, label }) => (
                <div key={label}>
                  <div style={{ fontSize:22, fontWeight:500, color:"var(--color-text-primary)", lineHeight:1 }}>
                    <Counter target={val} suffix={suffix} />
                  </div>
                  <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginTop:3 }}>{label}</div>
                </div>
              ))}
            </div>

            <button type="button" onClick={onOpenDashboard}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"11px 22px", fontSize:13, fontWeight:500,
                borderRadius:10, border:"none", cursor:"pointer",
                background: btnHovered ? "#0C447C" : "#185FA5",
                color:"#E6F1FB",
                transform: btnHovered ? "translateY(-1px)" : "translateY(0)",
                boxShadow: btnHovered ? "0 8px 20px rgba(24,95,165,0.3)" : "0 2px 8px rgba(24,95,165,0.2)",
                transition:"all 0.2s ease",
              }}>
              Open Dashboard
              <span style={{ display:"flex", transform: btnHovered ? "translateX(3px)" : "translateX(0)", transition:"transform 0.2s" }}>
                <ArrowRight />
              </span>
            </button>
          </div>
        </section>

        {/* ── Status cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          <StatusCard label="Frontend" value="React + Vite" tone="accent" icon={<CodeIcon />} delay={0.05} />
          <StatusCard label="Backend"  value="FastAPI API"  tone="default" icon={<ServerIcon />} delay={0.12} />
          <StatusCard label="Next Step" value="Connect live data" tone="success" icon={<RefreshIcon />} delay={0.19} />
        </div>

        {/* ── Feature split ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {sections.map(({ key, icon, accent, bg, label, items }, si) => (
            <div key={key}
              onMouseEnter={() => setSecHovered(key)}
              onMouseLeave={() => setSecHovered(null)}
              style={{
                background:"var(--color-background-primary)",
                border:"0.5px solid var(--color-border-tertiary)",
                borderRadius:14, padding:"20px", overflow:"hidden",
                transform: secHovered===key ? "translateY(-2px)" : "translateY(0)",
                boxShadow: secHovered===key ? "0 8px 24px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.03)",
                transition:"transform 0.2s ease, box-shadow 0.2s ease",
                animation:`fadeUp 0.4s ease ${0.25 + si*0.1}s both`,
              }}>
              {/* Section header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:bg,
                  display:"flex", alignItems:"center", justifyContent:"center", color:accent, flexShrink:0 }}>
                  {icon}
                </div>
                <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)" }}>{label}</div>
              </div>

              <ul style={{ margin:0, padding:0 }}>
                {items.map((text, i) => (
                  <Feature key={text} text={text} delay={300 + si * 100 + i * 80} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── CTA banner ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
          background:"#E6F1FB", border:"1px solid #B5D4F4", borderRadius:14, padding:"18px 24px",
          animation:"fadeUp 0.5s ease 0.45s both",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"#185FA5",
              display:"flex", alignItems:"center", justifyContent:"center", color:"#E6F1FB", flexShrink:0 }}>
              <UploadIcon />
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:"#042C53", marginBottom:2 }}>
                Ready to start backing up?
              </div>
              <div style={{ fontSize:12, color:"#185FA5", opacity:0.8 }}>
                Open the dashboard, upload files, and connect your FastAPI backend.
              </div>
            </div>
          </div>
          <button type="button" onClick={onOpenDashboard}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px",
              fontSize:12, fontWeight:500, borderRadius:8, border:"1px solid #B5D4F4",
              background:"#185FA5", color:"#E6F1FB", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
            <DatabaseIcon /> Get Started <ChevronIcon />
          </button>
        </div>

      </div>
    </>
  );
}