import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import RecoveryPage from "./pages/RecoveryPage";

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, d2, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"block" }}>
    <path d={d}/>{d2 && <path d={d2}/>}
  </svg>
);
const HomeIcon    = () => <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10"/>;
const DashIcon    = () => <Icon d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>;
const ShieldIcon  = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const CloudIcon   = () => <Icon d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>;
const PulseIcon   = () => <Icon d="M22 12h-4l-3 9L9 3l-3 9H2"/>;
const ChevronIcon = () => <Icon d="M9 18l6-6-6-6" size={13}/>;
const MenuIcon    = () => <Icon d="M3 12h18M3 6h18M3 18h18" size={16}/>;
const XIcon       = () => <Icon d="M18 6L6 18M6 6l12 12" size={16}/>;

// ── Nav config ───────────────────────────────────────────────────────────────
const tabs = [
  { id: "home",      label: "Overview",   sub: "Start here",        icon: <HomeIcon /> },
  { id: "dashboard", label: "Dashboard",  sub: "Upload & monitor",  icon: <DashIcon /> },
  { id: "recovery",  label: "Recovery",   sub: "Restore files",     icon: <ShieldIcon /> },
];

const stats = [
  { label: "Uptime",   value: "99.9%",  color: "#A9A4F5" },
  { label: "Synced",   value: "14 GB",  color: "#7BE8C0" },
  { label: "Devices",  value: "3",      color: "#F5A89A" },
];

// ── Animated orb background ───────────────────────────────────────────────────
function Orbs() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", borderRadius:"inherit" }}>
      {[
        { w:160, h:160, top:-40, left:-40,  bg:"rgba(127,119,221,0.18)", dur:"8s" },
        { w:120, h:120, top:"55%", left:-30, bg:"rgba(93,202,165,0.13)", dur:"11s" },
        { w:100, h:100, bottom:-20, right:-20, bg:"rgba(245,168,154,0.12)", dur:"9s" },
      ].map((o, i) => (
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.h,
          top: o.top ?? undefined, left: o.left ?? undefined,
          bottom: o.bottom ?? undefined, right: o.right ?? undefined,
          borderRadius:"50%", background: o.bg,
          animation: `orbFloat ${o.dur} ease-in-out infinite alternate`,
          animationDelay: `${i * 1.5}s`,
          filter: "blur(32px)",
        }}/>
      ))}
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered,   setHovered]   = useState(null);
  const [time,      setTime]      = useState(new Date());
  const [pageVis,   setPageVis]   = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Determine active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/" || path === "/home") return "home";
    if (path === "/dashboard") return "dashboard";
    if (path === "/recovery") return "recovery";
    return "home";
  };

  const active = getActiveTab();

  // Page transition flicker
  const handleNav = (id) => {
    const paths = {
      home: "/",
      dashboard: "/dashboard",
      recovery: "/recovery",
    };
    if (id === active) return;
    setPageVis(false);
    setTimeout(() => {
      navigate(paths[id]);
      setPageVis(true);
    }, 180);
  };

  const W = collapsed ? 72 : 240;

  return (
    <>
      <style>{`
        @keyframes orbFloat   { from{transform:translateY(0) scale(1)} to{transform:translateY(18px) scale(1.06)} }
        @keyframes fadeSlideIn{ from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pageIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes tickIn     { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes indicSlide { from{transform:scaleY(0)} to{transform:scaleY(1)} }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden",
        fontFamily:"var(--font-sans)", background:"var(--color-background-tertiary)" }}>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside style={{
          width: W,
          minWidth: W,
          height: "100vh",
          background: "linear-gradient(160deg, #1a1333 0%, #0f1f2e 55%, #0a2318 100%)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>
          <Orbs />

          {/* ── Top: logo + collapse ── */}
          <div style={{ position:"relative", padding: collapsed ? "20px 0 16px" : "22px 18px 16px",
            display:"flex", alignItems:"center",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom:"1px solid rgba(255,255,255,0.07)" }}>

            {!collapsed && (
              <div style={{ animation:"fadeSlideIn 0.3s ease both" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <div style={{ width:28, height:28, borderRadius:8,
                    background:"linear-gradient(135deg,#7F77DD,#5DCAA5)",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <CloudIcon />
                  </div>
                  <span style={{ fontSize:14, fontWeight:500, color:"#fff", letterSpacing:"-0.01em" }}>
                    PiCloud
                  </span>
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)",
                  textTransform:"uppercase", letterSpacing:"0.1em", paddingLeft:36 }}>
                  Private Backup
                </div>
              </div>
            )}

            {collapsed && (
              <div style={{ width:32, height:32, borderRadius:8,
                background:"linear-gradient(135deg,#7F77DD,#5DCAA5)",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <CloudIcon />
              </div>
            )}

            <button onClick={() => setCollapsed(v => !v)} style={{
              background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:7, width:28, height:28, display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,0.6)",
              transition:"background 0.15s",
              ...(collapsed ? { position:"absolute", bottom:-14, right:-10, zIndex:10,
                background:"#1a1333", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:"50%", width:24, height:24 } : {}),
            }}>
              {collapsed ? <ChevronIcon /> : <XIcon />}
            </button>
          </div>

          {/* ── Live clock ── */}
          {!collapsed && (
            <div style={{ position:"relative", padding:"12px 18px",
              borderBottom:"1px solid rgba(255,255,255,0.06)",
              animation:"fadeSlideIn 0.35s ease both" }}>
              <div style={{ fontSize:22, fontWeight:500, color:"#fff", letterSpacing:"0.04em",
                fontVariantNumeric:"tabular-nums", animation:"tickIn 0.2s ease" }}
                key={time.toLocaleTimeString()}>
                {time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" })}
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)",
                textTransform:"uppercase", letterSpacing:"0.08em", marginTop:2 }}>
                {time.toLocaleDateString([], { weekday:"short", month:"short", day:"numeric" })}
              </div>
            </div>
          )}

          {/* ── Nav ── */}
          <nav style={{ position:"relative", padding: collapsed ? "12px 8px" : "12px 10px",
            flex:1, display:"flex", flexDirection:"column", gap:3 }}>
            {tabs.map((tab, i) => {
              const isActive = active === tab.id;
              const isHov    = hovered === tab.id;
              return (
                <button key={tab.id} type="button"
                  onClick={() => handleNav(tab.id)}
                  onMouseEnter={() => setHovered(tab.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position:"relative",
                    display:"flex", alignItems:"center",
                    gap: collapsed ? 0 : 12,
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "10px" : "10px 12px",
                    borderRadius:10, border:"none", cursor:"pointer", width:"100%",
                    background: isActive
                      ? "rgba(127,119,221,0.22)"
                      : isHov ? "rgba(255,255,255,0.06)" : "transparent",
                    transition:"background 0.18s ease",
                    animation:`fadeSlideIn 0.3s ease ${i * 0.07}s both`,
                    outline:"none",
                  }}>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div style={{
                      position:"absolute", left:0, top:"18%", bottom:"18%",
                      width:3, borderRadius:"0 3px 3px 0",
                      background:"linear-gradient(180deg,#A9A4F5,#7BE8C0)",
                      animation:"indicSlide 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
                    }}/>
                  )}

                  {/* Icon chip */}
                  <div style={{
                    width:32, height:32, borderRadius:8, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: isActive
                      ? "linear-gradient(135deg,rgba(127,119,221,0.5),rgba(93,202,165,0.4))"
                      : "rgba(255,255,255,0.07)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                    transition:"background 0.2s, color 0.2s",
                    border: isActive ? "1px solid rgba(169,164,245,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  }}>
                    {tab.icon}
                  </div>

                  {/* Label */}
                  {!collapsed && (
                    <div style={{ textAlign:"left", overflow:"hidden" }}>
                      <div style={{ fontSize:13, fontWeight:500,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                        lineHeight:1.2, transition:"color 0.2s" }}>
                        {tab.label}
                      </div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)",
                        marginTop:1, whiteSpace:"nowrap", overflow:"hidden",
                        textOverflow:"ellipsis" }}>
                        {tab.sub}
                      </div>
                    </div>
                  )}

                  {/* Active dot (collapsed) */}
                  {collapsed && isActive && (
                    <div style={{ position:"absolute", bottom:5, left:"50%",
                      transform:"translateX(-50%)", width:4, height:4,
                      borderRadius:"50%", background:"#A9A4F5" }}/>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Stats strip ── */}
          {!collapsed && (
            <div style={{ position:"relative", padding:"14px 14px",
              borderTop:"1px solid rgba(255,255,255,0.07)",
              display:"flex", flexDirection:"column", gap:8,
              animation:"fadeSlideIn 0.4s ease both" }}>
              <div style={{ fontSize:10, fontWeight:500, color:"rgba(255,255,255,0.3)",
                textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:2 }}>
                System
              </div>
              {stats.map(s => (
                <div key={s.label} style={{ display:"flex", alignItems:"center",
                  justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%",
                      background:s.color, animation:"pulse 2.5s ease-in-out infinite" }}/>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize:11, fontWeight:500, color:s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Status dot (collapsed) ── */}
          {collapsed && (
            <div style={{ position:"relative", padding:"14px 0", display:"flex",
              justifyContent:"center", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#7BE8C0",
                animation:"pulse 2s ease-in-out infinite" }}/>
            </div>
          )}

          {/* ── Footer ── */}
          {!collapsed && (
            <div style={{ position:"relative", padding:"12px 16px",
              borderTop:"1px solid rgba(255,255,255,0.06)",
              display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:"50%",
                background:"linear-gradient(135deg,#7F77DD,#5DCAA5)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:500, color:"#fff", flexShrink:0 }}>
                Pi
              </div>
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.8)",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  pi@localhost
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>Administrator</div>
              </div>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#7BE8C0",
                boxShadow:"0 0 0 2px rgba(123,232,192,0.25)", flexShrink:0 }}>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main style={{
          flex:1, overflowY:"auto", height:"100vh",
          opacity: pageVis ? 1 : 0,
          transform: pageVis ? "translateY(0)" : "translateY(8px)",
          transition:"opacity 0.2s ease, transform 0.2s ease",
        }}>
          <Routes>
            <Route path="/" element={<HomePage onOpenDashboard={() => handleNav("dashboard")} />} />
            <Route path="/home" element={<HomePage onOpenDashboard={() => handleNav("dashboard")} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}