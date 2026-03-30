import { useEffect, useState, useCallback } from "react";

// ── Mock stubs (replace with real imports) ──────────────────────────────────
const fetchFiles  = async (id, pin) => { await new Promise(r => setTimeout(r, 900)); return { files: [{ file_name: "report.pdf", size: "2.4 MB", time: "2025-03-28 10:32" }, { file_name: "assets.zip", size: "15.8 MB", time: "2025-03-27 14:15" }] }; };
const uploadFiles = async (id, pin, files) => { await new Promise(r => setTimeout(r, 1200)); return { status: "ok" }; };

// ── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const RefreshIcon = ({ spin }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: spin ? "spin 0.8s linear infinite" : "none" }}>
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const DeviceIcon  = () => <Icon d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01" />;
const FileIcon2   = () => <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />;
const CloudIcon   = () => <Icon d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />;
const LockIcon    = () => <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" />;
const UpIcon      = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const EyeIcon     = ({ off }) => off
  ? <Icon d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
  : <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const RemoveIcon  = () => <Icon d="M18 6L6 18M6 6l12 12" size={11} />;

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmt = b => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;

// ── StatusCard ───────────────────────────────────────────────────────────────
const tones = {
  default: { bg:"#F1EFE8", border:"#B4B2A9", text:"#2C2C2A", muted:"#5F5E5A", accent:"#888780", glow:"rgba(136,135,128,0.12)" },
  success: { bg:"#E1F5EE", border:"#5DCAA5", text:"#04342C", muted:"#0F6E56", accent:"#1D9E75", glow:"rgba(29,158,117,0.12)" },
  accent:  { bg:"#E6F1FB", border:"#85B7EB", text:"#042C53", muted:"#185FA5", accent:"#378ADD", glow:"rgba(55,138,221,0.12)" },
  warning: { bg:"#FAEEDA", border:"#EF9F27", text:"#412402", muted:"#854F0B", accent:"#BA7517", glow:"rgba(186,117,23,0.12)" },
  danger:  { bg:"#FCEBEB", border:"#F09595", text:"#501313", muted:"#A32D2D", accent:"#E24B4A", glow:"rgba(226,75,74,0.12)" },
};

function StatusCard({ label, value, tone = "default", icon }) {
  const c = tones[tone] ?? tones.default;
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative", background:c.bg, border:`1px solid ${c.border}`,
        borderRadius:14, padding:"16px 18px", overflow:"hidden", cursor:"default",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${c.glow}` : `0 2px 8px ${c.glow}`,
        transition:"transform 0.2s ease, box-shadow 0.2s ease",
        animation:"cardIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both",
        minWidth:0,
      }}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:c.accent, borderRadius:"14px 14px 0 0",
        transform:"scaleX(1)", transformOrigin:"left", transition:"transform 0.5s ease" }} />
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:500,
        color:c.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
        {icon && <span style={{ color:c.accent }}>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize:20, fontWeight:500, color:c.text, lineHeight:1.2,
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value}</div>
    </article>
  );
}

// ── UploadForm ───────────────────────────────────────────────────────────────
function UploadForm({ onUpload }) {
  const [deviceId, setDeviceId] = useState("phoneA");
  const [pin, setPin]           = useState("1234");
  const [showPin, setShowPin]   = useState(false);
  const [files, setFiles]       = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focus, setFocus]       = useState(null);
  const fileRef = useState(null);
  const inputRef = { current: null };

  const addFiles = useCallback(incoming => {
    const arr = Array.from(incoming);
    setFiles(prev => { const s = new Set(prev.map(f=>f.name)); return [...prev, ...arr.filter(f=>!s.has(f.name))]; });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!files.length || loading) return;
    setLoading(true);
    try { await onUpload({ deviceId, pin, files }); setFiles([]); }
    finally { setLoading(false); }
  };

  const fStyle = f => focus === f ? { borderColor:"#378ADD", boxShadow:"0 0 0 3px rgba(55,138,221,0.15)" } : {};

  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)",
      borderRadius:14, padding:"20px 22px", animation:"fadeUp 0.35s ease both" }}>
      <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)", marginBottom:16,
        display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:"#378ADD",
          boxShadow:"0 0 0 3px rgba(55,138,221,0.15)", display:"inline-block", flexShrink:0,
          animation:"pulse 2s ease-in-out infinite" }} />
        Upload Backup
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          {/* Device ID */}
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:500, color:"var(--color-text-secondary)",
              textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Device ID</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
                color:"var(--color-text-secondary)", display:"flex" }}><DeviceIcon /></span>
              <input value={deviceId} onChange={e=>setDeviceId(e.target.value)} placeholder="phoneA"
                onFocus={()=>setFocus("id")} onBlur={()=>setFocus(null)}
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 10px 8px 32px", fontSize:13,
                  border:"0.5px solid var(--color-border-secondary)", borderRadius:8,
                  background:"var(--color-background-secondary)", color:"var(--color-text-primary)",
                  outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", ...fStyle("id") }} />
            </div>
          </div>
          {/* PIN */}
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:500, color:"var(--color-text-secondary)",
              textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>PIN</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
                color:"var(--color-text-secondary)", display:"flex" }}><LockIcon /></span>
              <input value={pin} type={showPin?"text":"password"} onChange={e=>setPin(e.target.value)}
                placeholder="••••" onFocus={()=>setFocus("pin")} onBlur={()=>setFocus(null)}
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 32px 8px 32px", fontSize:13,
                  border:"0.5px solid var(--color-border-secondary)", borderRadius:8,
                  background:"var(--color-background-secondary)", color:"var(--color-text-primary)",
                  outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", ...fStyle("pin") }} />
              <button type="button" onClick={()=>setShowPin(v=>!v)}
                style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", color:"var(--color-text-secondary)",
                  display:"flex", padding:2 }}><EyeIcon off={showPin} /></button>
            </div>
          </div>
        </div>

        {/* Dropzone */}
        <div style={{ marginBottom:12 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:500, color:"var(--color-text-secondary)",
            textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Backup Files</label>
          <div onClick={()=>inputRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files)}}
            style={{ border:`1.5px dashed ${dragging?"#378ADD":"var(--color-border-secondary)"}`,
              borderRadius:10, padding:"22px 16px", textAlign:"center", cursor:"pointer",
              background: dragging?"#E6F1FB":"var(--color-background-secondary)",
              transition:"border-color 0.2s, background 0.2s" }}>
            <div style={{ width:34, height:34, margin:"0 auto 8px", borderRadius:8,
              background:"#E6F1FB", display:"flex", alignItems:"center", justifyContent:"center", color:"#185FA5" }}>
              <UpIcon />
            </div>
            <div style={{ fontSize:12, color:"var(--color-text-secondary)" }}>
              {dragging ? "Drop to add files" : "Drag & drop or click to browse"}
            </div>
            <div style={{ fontSize:11, color:"var(--color-text-secondary)", opacity:0.55, marginTop:3 }}>Any file type · Multiple allowed</div>
            <input ref={r=>{inputRef.current=r}} type="file" multiple style={{ display:"none" }}
              onChange={e=>addFiles(e.target.files)} />
          </div>

          {files.length > 0 && (
            <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:5 }}>
              {files.map((f,i) => (
                <div key={f.name} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px",
                  background:"#E6F1FB", border:"0.5px solid #B5D4F4", borderRadius:7, fontSize:12,
                  animation:`rowIn 0.2s ease ${i*0.04}s both` }}>
                  <span style={{ color:"#185FA5" }}><FileIcon2 /></span>
                  <span style={{ flex:1, color:"#042C53", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                  <span style={{ color:"#185FA5", opacity:0.7, flexShrink:0 }}>{fmt(f.size)}</span>
                  <button type="button" onClick={()=>setFiles(p=>p.filter(x=>x.name!==f.name))}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#185FA5",
                      opacity:0.6, padding:0, display:"flex" }}><RemoveIcon /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={!files.length||loading}
          style={{ width:"100%", padding:"9px 16px", fontSize:13, fontWeight:500,
            borderRadius:8, border:"none", cursor: files.length&&!loading?"pointer":"not-allowed",
            background: files.length&&!loading?"#185FA5":"#B5D4F4", color:"#E6F1FB",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            transition:"background 0.2s, transform 0.15s" }}>
          {loading ? <><RefreshIcon spin /> Uploading…</> : <><UpIcon /> Upload Backup</>}
        </button>
      </form>
    </div>
  );
}

// ── FileList ─────────────────────────────────────────────────────────────────
function FileList({ files, emptyText }) {
  const [hovered, setHovered] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...files].sort((a,b) => {
    if (!sortKey) return 0;
    return sortAsc ? (a[sortKey]??"").localeCompare(b[sortKey]??"") : (b[sortKey]??"").localeCompare(a[sortKey]??"");
  });

  const handleSort = k => { if (sortKey===k) setSortAsc(v=>!v); else { setSortKey(k); setSortAsc(true); } };

  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)",
      borderRadius:14, overflow:"hidden", animation:"fadeUp 0.45s ease both" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"13px 20px", borderBottom:"0.5px solid var(--color-border-tertiary)",
        background:"var(--color-background-secondary)" }}>
        <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)",
          display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#1D9E75",
            boxShadow:"0 0 0 3px rgba(29,158,117,0.15)", display:"inline-block",
            animation:"pulse 2s ease-in-out infinite" }} />
          Stored Files
        </div>
        {files.length > 0 && (
          <span style={{ fontSize:11, fontWeight:500, color:"#0F6E56", background:"#E1F5EE",
            padding:"3px 9px", borderRadius:20 }}>{files.length} file{files.length!==1?"s":""}</span>
        )}
      </div>

      {sorted.length ? (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"var(--color-background-secondary)" }}>
                {[["file_name","Name"],["size","Size"],["time","Time"]].map(([k,l]) => (
                  <th key={k} onClick={()=>handleSort(k)}
                    style={{ padding:"9px 20px", textAlign: k==="file_name"?"left":"right",
                      fontSize:11, fontWeight:500, color:"var(--color-text-secondary)",
                      textTransform:"uppercase", letterSpacing:"0.06em",
                      borderBottom:"0.5px solid var(--color-border-tertiary)",
                      cursor:"pointer", userSelect:"none", whiteSpace:"nowrap" }}>
                    {l}
                    <span style={{ marginLeft:4, opacity: sortKey===k?1:0.3, color: sortKey===k?"#1D9E75":"inherit" }}>
                      {sortKey===k ? (sortAsc?"↑":"↓") : "↕"}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((file,i) => (
                <tr key={`${file.file_name}-${file.time}`}
                  onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
                  style={{ animation:`rowIn 0.25s ease ${i*0.05}s both`,
                    background: hovered===i?"var(--color-background-secondary)":"transparent",
                    transition:"background 0.15s" }}>
                  <td style={{ padding:"10px 20px", borderBottom: i===sorted.length-1?"none":"0.5px solid var(--color-border-tertiary)", color:"var(--color-text-primary)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:26, height:26, borderRadius:6, background:"#E1F5EE",
                        display:"flex", alignItems:"center", justifyContent:"center", color:"#0F6E56", flexShrink:0 }}>
                        <FileIcon2 />
                      </div>
                      <span style={{ fontWeight:500 }}>{file.file_name}</span>
                    </div>
                  </td>
                  {["size","time"].map(col => (
                    <td key={col} style={{ padding:"10px 20px", textAlign:"right",
                      borderBottom: i===sorted.length-1?"none":"0.5px solid var(--color-border-tertiary)",
                      color:"var(--color-text-secondary)", fontVariantNumeric:"tabular-nums" }}>
                      {file[col] ?? <span style={{ opacity:0.35 }}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10,
          padding:"44px 20px", color:"var(--color-text-secondary)", fontSize:13,
          animation:"fadeUp 0.3s ease both" }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"var(--color-background-secondary)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)" }}>
            <CloudIcon />
          </div>
          <span>{emptyText}</span>
        </div>
      )}
    </div>
  );
}

// ── DashboardPage ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [files,    setFiles]    = useState([]);
  const [deviceId, setDeviceId] = useState("phoneA");
  const [pin,      setPin]      = useState("1234");
  const [status,   setStatus]   = useState({ msg:"Ready to connect with your FastAPI backend.", tone:"default" });
  const [refreshing, setRefreshing] = useState(false);

  const loadFiles = useCallback(async (id=deviceId, p=pin) => {
    setRefreshing(true);
    try {
      const data = await fetchFiles(id, p);
      setFiles(data.files || []);
      setStatus({ msg:"File list refreshed successfully.", tone:"success" });
    } catch (e) {
      setStatus({ msg: e.message, tone:"danger" });
    } finally { setRefreshing(false); }
  }, [deviceId, pin]);

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async ({ deviceId:id, pin:p, files:f }) => {
    try {
      const res = await uploadFiles(id, p, f);
      setDeviceId(id); setPin(p);
      setStatus({ msg: res.status==="ok" ? "Upload completed successfully." : "Upload finished.", tone:"success" });
      await loadFiles(id, p);
    } catch (e) { setStatus({ msg: e.message, tone:"danger" }); }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn  { from{opacity:0;transform:scale(0.94) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes rowIn   { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:780, margin:"0 auto",
        padding:"24px 16px", fontFamily:"var(--font-sans)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          animation:"fadeUp 0.3s ease both" }}>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:500, color:"var(--color-text-primary)" }}>File Backup Dashboard</h1>
            <p style={{ margin:"3px 0 0", fontSize:13, color:"var(--color-text-secondary)" }}>Manage and sync your device backups</p>
          </div>
          <div style={{ width:8, height:8, borderRadius:"50%",
            background: refreshing?"#BA7517":"#1D9E75",
            boxShadow:`0 0 0 3px ${refreshing?"rgba(186,117,23,0.2)":"rgba(29,158,117,0.2)"}`,
            animation:"pulse 2s ease-in-out infinite", transition:"background 0.3s" }} />
        </div>

        {/* Status cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12,
          animation:"fadeUp 0.35s ease both" }}>
          <StatusCard label="Device" value={deviceId} tone="default" icon={<DeviceIcon />} />
          <StatusCard label="Stored Files" value={`${files.length} file${files.length!==1?"s":""}`} tone="accent" icon={<FileIcon2 />} />
          <StatusCard label="API Status" value={status.msg} tone={status.tone} icon={<CloudIcon />} />
        </div>

        {/* Upload form */}
        <UploadForm onUpload={handleUpload} />

        {/* Refresh panel */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)",
          borderRadius:14, padding:"14px 20px", animation:"fadeUp 0.5s ease both", gap:16 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:"var(--color-text-primary)", marginBottom:2 }}>
              Refresh cloud records
            </div>
            <div style={{ fontSize:12, color:"var(--color-text-secondary)" }}>
              Fetch the latest files for the current device credentials.
            </div>
          </div>
          <button type="button" onClick={()=>loadFiles()} disabled={refreshing}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", fontSize:12,
              fontWeight:500, borderRadius:8, border:"0.5px solid var(--color-border-secondary)",
              background:"var(--color-background-secondary)", color:"var(--color-text-primary)",
              cursor: refreshing?"not-allowed":"pointer", opacity: refreshing?0.7:1,
              whiteSpace:"nowrap", flexShrink:0, transition:"opacity 0.2s" }}>
            <RefreshIcon spin={refreshing} />
            {refreshing ? "Refreshing…" : "Refresh List"}
          </button>
        </div>

        {/* File list */}
        <FileList
          files={files}
          emptyText="No files yet — upload a backup or verify your backend is running."
        />
      </div>
    </>
  );
}