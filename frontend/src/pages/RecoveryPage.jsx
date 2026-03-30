import { useEffect, useState, useCallback } from "react";

// ── Mock stub (replace with real import) ─────────────────────────────────────
const fetchRecovery = async () => {
  await new Promise(r => setTimeout(r, 1000));
  return {
    recovered_files: [
      "backup_2025-03-28_phoneA.zip",
      "photos_march_compressed.tar.gz",
      "contacts_export.vcf",
      "notes_sync_v2.json",
      "app_data_snapshot.db",
    ]
  };
};

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, d2, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>{d2 && <path d={d2}/>}
  </svg>
);
const RefreshIcon  = ({ spin }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round"
    style={{ animation: spin ? "spin 0.8s linear infinite" : "none", display:"block" }}>
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const ShieldIcon   = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={16}/>;
const ArchiveIcon  = () => <Icon d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" size={14}/>;
const FileIcon     = () => <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6" size={13}/>;
const DownloadIcon = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13}/>;
const CheckIcon    = () => <Icon d="M20 6L9 17l-5-5" size={12}/>;
const AlertIcon    = () => <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={14}/>;

// ── Tones ────────────────────────────────────────────────────────────────────
const tones = {
  default: { bg:"#F1EFE8", border:"#B4B2A9", text:"#2C2C2A", muted:"#5F5E5A", accent:"#888780", glow:"rgba(136,135,128,0.12)" },
  success: { bg:"#E1F5EE", border:"#5DCAA5", text:"#04342C", muted:"#0F6E56", accent:"#1D9E75", glow:"rgba(29,158,117,0.12)" },
  accent:  { bg:"#E6F1FB", border:"#85B7EB", text:"#042C53", muted:"#185FA5", accent:"#378ADD", glow:"rgba(55,138,221,0.12)" },
  warning: { bg:"#FAEEDA", border:"#EF9F27", text:"#412402", muted:"#854F0B", accent:"#BA7517", glow:"rgba(186,117,23,0.12)" },
  danger:  { bg:"#FCEBEB", border:"#F09595", text:"#501313", muted:"#A32D2D", accent:"#E24B4A", glow:"rgba(226,75,74,0.12)" },
};

// ── StatusCard ───────────────────────────────────────────────────────────────
function StatusCard({ label, value, tone = "default", icon, delay = 0 }) {
  const c = tones[tone] ?? tones.default;
  const [hov, setHov] = useState(false);
  return (
    <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position:"relative", background:c.bg, border:`1px solid ${c.border}`,
        borderRadius:14, padding:"16px 18px 14px", overflow:"hidden", cursor:"default",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 10px 28px ${c.glow}` : `0 2px 8px ${c.glow}`,
        transition:"transform 0.22s ease, box-shadow 0.22s ease",
        animation:`cardIn 0.5s cubic-bezier(0.34,1.4,0.64,1) ${delay}s both`,
        minWidth:0,
      }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
        background:c.accent, borderRadius:"14px 14px 0 0" }}/>
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:500,
        color:c.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
        {icon && <span style={{ color:c.accent }}>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize:18, fontWeight:500, color:c.text, lineHeight:1.25,
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value}</div>
    </article>
  );
}

// ── File type badge ───────────────────────────────────────────────────────────
const extMeta = {
  zip:  { label:"ZIP",  bg:"#E6F1FB", border:"#B5D4F4", text:"#0C447C" },
  gz:   { label:"GZ",   bg:"#EAF3DE", border:"#C0DD97", text:"#27500A" },
  tar:  { label:"TAR",  bg:"#EAF3DE", border:"#C0DD97", text:"#27500A" },
  vcf:  { label:"VCF",  bg:"#FBEAF0", border:"#F4C0D1", text:"#4B1528" },
  json: { label:"JSON", bg:"#FAEEDA", border:"#FAC775", text:"#412402" },
  db:   { label:"DB",   bg:"#EEEDFE", border:"#CECBF6", text:"#26215C" },
};
function ExtBadge({ filename }) {
  const parts = filename.split(".");
  const raw = parts[parts.length - 1]?.toLowerCase();
  // handle double extensions like .tar.gz
  const ext = parts.length >= 3 && parts[parts.length - 2] === "tar" ? "gz" : raw;
  const m = extMeta[ext] ?? { label: ext?.toUpperCase() ?? "?", bg:"#F1EFE8", border:"#B4B2A9", text:"#444441" };
  return (
    <span style={{ fontSize:10, fontWeight:500, padding:"2px 7px", borderRadius:6,
      background:m.bg, border:`0.5px solid ${m.border}`, color:m.text,
      textTransform:"uppercase", letterSpacing:"0.05em", flexShrink:0 }}>
      {m.label}
    </span>
  );
}

// ── Recovery row ─────────────────────────────────────────────────────────────
function RecoveryRow({ item, index, onRestore, restored }) {
  const [hov, setHov] = useState(false);
  return (
    <li onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"11px 18px",
        borderBottom:"0.5px solid var(--color-border-tertiary)",
        background: hov ? "var(--color-background-secondary)" : "transparent",
        transition:"background 0.15s ease",
        animation:`rowIn 0.28s ease ${index * 0.06}s both`,
        listStyle:"none",
      }}>
      {/* File icon chip */}
      <div style={{ width:30, height:30, borderRadius:8, background:"#E1F5EE",
        display:"flex", alignItems:"center", justifyContent:"center",
        color:"#0F6E56", flexShrink:0 }}>
        <FileIcon />
      </div>

      {/* Name */}
      <span style={{ flex:1, fontSize:13, fontWeight:500,
        color:"var(--color-text-primary)", overflow:"hidden",
        textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {item}
      </span>

      <ExtBadge filename={item} />

      {/* Restore button */}
      <button type="button" onClick={() => onRestore(item)}
        style={{
          display:"flex", alignItems:"center", gap:5, padding:"5px 11px",
          fontSize:11, fontWeight:500, borderRadius:7, cursor:"pointer",
          border: restored ? "0.5px solid #5DCAA5" : "0.5px solid var(--color-border-secondary)",
          background: restored ? "#E1F5EE" : hov ? "var(--color-background-primary)" : "transparent",
          color: restored ? "#0F6E56" : "var(--color-text-secondary)",
          transition:"all 0.2s ease", flexShrink:0,
        }}>
        {restored ? <><CheckIcon /> Restored</> : <><DownloadIcon /> Restore</>}
      </button>
    </li>
  );
}

// ── RecoveryPage ─────────────────────────────────────────────────────────────
export default function RecoveryPage() {
  const [items,      setItems]      = useState([]);
  const [status,     setStatus]     = useState({ msg:"Checking backup copy directory.", tone:"default" });
  const [loading,    setLoading]    = useState(false);
  const [restored,   setRestored]   = useState(new Set());
  const [search,     setSearch]     = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const loadRecovery = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRecovery();
      setItems(data.recovered_files || []);
      setStatus({ msg:"Recovery list loaded.", tone:"success" });
    } catch (e) {
      setStatus({ msg: e.message, tone:"danger" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRecovery(); }, []);

  const handleRestore = (item) =>
    setRestored(prev => new Set([...prev, item]));

  const filtered = items.filter(i =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  const restoredCount = restored.size;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn { from{opacity:0;transform:scale(0.93) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes rowIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:820,
        margin:"0 auto", padding:"24px 16px", fontFamily:"var(--font-sans)" }}>

        {/* ── Page header ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          animation:"fadeUp 0.3s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"#E1F5EE",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#0F6E56", animation:"floatY 3.5s ease-in-out infinite" }}>
              <ShieldIcon />
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:20, fontWeight:500,
                color:"var(--color-text-primary)" }}>Recovery Center</h1>
              <p style={{ margin:"2px 0 0", fontSize:12,
                color:"var(--color-text-secondary)" }}>
                Inspect and restore files from your backend /recover endpoint
              </p>
            </div>
          </div>
          <span style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
            background: loading ? "#BA7517" : status.tone === "success" ? "#1D9E75" : "#E24B4A",
            boxShadow:`0 0 0 3px ${loading ? "rgba(186,117,23,0.2)" : status.tone === "success" ? "rgba(29,158,117,0.2)" : "rgba(226,75,74,0.2)"}`,
            animation:"pulse 2s ease-in-out infinite", transition:"background 0.3s" }} />
        </div>

        {/* ── Status cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          <StatusCard label="Recovery Files" value={`${items.length} found`}
            tone="accent" icon={<ArchiveIcon />} delay={0.05} />
          <StatusCard label="Restored" value={`${restoredCount} file${restoredCount !== 1 ? "s" : ""}`}
            tone={restoredCount > 0 ? "success" : "default"} icon={<CheckIcon />} delay={0.12} />
          <StatusCard label="API Status" value={status.msg}
            tone={status.tone} icon={<AlertIcon />} delay={0.19} />
        </div>

        {/* ── Action bar ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:14,
          background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-tertiary)",
          borderRadius:14, padding:"14px 18px",
          animation:"fadeUp 0.38s ease both",
        }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500,
              color:"var(--color-text-primary)", marginBottom:2 }}>
              Backup copy visibility
            </div>
            <div style={{ fontSize:12, color:"var(--color-text-secondary)" }}>
              Reads the backend <code style={{ fontSize:11, padding:"1px 5px",
                background:"var(--color-background-secondary)",
                borderRadius:4, border:"0.5px solid var(--color-border-tertiary)" }}>/recover</code> endpoint
              to list restorable files.
            </div>
          </div>
          <button type="button" onClick={loadRecovery} disabled={loading}
            style={{
              display:"flex", alignItems:"center", gap:7, padding:"8px 14px",
              fontSize:12, fontWeight:500, borderRadius:8,
              border:"0.5px solid var(--color-border-secondary)",
              background:"var(--color-background-secondary)",
              color:"var(--color-text-primary)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              whiteSpace:"nowrap", flexShrink:0,
              transition:"opacity 0.2s",
            }}>
            <RefreshIcon spin={loading} />
            {loading ? "Refreshing…" : "Refresh Recovery"}
          </button>
        </div>

        {/* ── Inventory panel ── */}
        <div style={{
          background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-tertiary)",
          borderRadius:14, overflow:"hidden",
          animation:"fadeUp 0.45s ease both",
        }}>
          {/* Panel header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"13px 18px", borderBottom:"0.5px solid var(--color-border-tertiary)",
            background:"var(--color-background-secondary)", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13,
              fontWeight:500, color:"var(--color-text-primary)" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#1D9E75",
                boxShadow:"0 0 0 3px rgba(29,158,117,0.15)", display:"inline-block",
                animation:"pulse 2s ease-in-out infinite" }} />
              Recovery Inventory
            </div>

            {/* Search box */}
            {items.length > 0 && (
              <div style={{ position:"relative", flexShrink:0 }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter files…"
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  style={{
                    padding:"5px 10px 5px 28px", fontSize:12, width:180,
                    border: searchFocus
                      ? "0.5px solid #378ADD"
                      : "0.5px solid var(--color-border-secondary)",
                    borderRadius:7,
                    background:"var(--color-background-primary)",
                    color:"var(--color-text-primary)", outline:"none",
                    boxShadow: searchFocus ? "0 0 0 3px rgba(55,138,221,0.12)" : "none",
                    transition:"border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                <span style={{ position:"absolute", left:9, top:"50%",
                  transform:"translateY(-50%)", color:"var(--color-text-secondary)",
                  pointerEvents:"none", display:"flex" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </span>
              </div>
            )}

            {items.length > 0 && (
              <span style={{ fontSize:11, fontWeight:500, color:"#0F6E56",
                background:"#E1F5EE", padding:"3px 9px", borderRadius:20, flexShrink:0 }}>
                {filtered.length} / {items.length}
              </span>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
              gap:10, padding:"44px 20px", color:"var(--color-text-secondary)", fontSize:13 }}>
              <RefreshIcon spin />
              Loading recovery files…
            </div>
          ) : filtered.length ? (
            <ul style={{ margin:0, padding:0 }}>
              {filtered.map((item, i) => (
                <RecoveryRow key={item} item={item} index={i}
                  onRestore={handleRestore}
                  restored={restored.has(item)} />
              ))}
            </ul>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
              gap:10, padding:"44px 20px", animation:"fadeUp 0.3s ease both" }}>
              <div style={{ width:38, height:38, borderRadius:10,
                background:"var(--color-background-secondary)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"var(--color-text-secondary)" }}>
                <ArchiveIcon />
              </div>
              <span style={{ fontSize:13, color:"var(--color-text-secondary)" }}>
                {search ? `No files match "${search}"` : "No recovery files returned by the backend yet."}
              </span>
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  style={{ fontSize:12, color:"#185FA5", background:"none",
                    border:"none", cursor:"pointer", textDecoration:"underline" }}>
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </>
  );
}