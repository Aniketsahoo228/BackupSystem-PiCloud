import { useState, useRef, useCallback } from "react";

const styles = {
  panel: {
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 14,
    padding: "24px",
    fontFamily: "var(--font-sans)",
    animation: "fadeInUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
  },
  title: {
    fontSize: 14, fontWeight: 500,
    color: "var(--color-text-primary)",
    margin: "0 0 20px",
    display: "flex", alignItems: "center", gap: 8,
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#378ADD",
    boxShadow: "0 0 0 3px rgba(55,138,221,0.15)",
    animation: "pulse 2s ease-in-out infinite",
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 14,
  },
  fieldFull: { gridColumn: "1 / -1" },
  label: {
    display: "block",
    fontSize: 11, fontWeight: 500,
    color: "var(--color-text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 6,
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%", boxSizing: "border-box",
    padding: "9px 12px 9px 36px",
    fontSize: 13,
    border: "0.5px solid var(--color-border-secondary)",
    borderRadius: 8,
    background: "var(--color-background-secondary)",
    color: "var(--color-text-primary)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputIcon: {
    position: "absolute", left: 11, top: "50%",
    transform: "translateY(-50%)",
    color: "var(--color-text-secondary)",
    pointerEvents: "none",
    display: "flex", alignItems: "center",
  },
  eyeBtn: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    color: "var(--color-text-secondary)", padding: 2,
    display: "flex", alignItems: "center",
  },
  dropzone: {
    border: "1.5px dashed var(--color-border-secondary)",
    borderRadius: 10,
    padding: "28px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    background: "var(--color-background-secondary)",
    position: "relative",
  },
  dropIcon: {
    width: 36, height: 36, margin: "0 auto 10px",
    borderRadius: 8,
    background: "#E6F1FB",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#185FA5",
  },
  dropLabel: { fontSize: 13, color: "var(--color-text-secondary)", margin: 0 },
  dropSub: { fontSize: 11, color: "var(--color-text-secondary)", opacity: 0.6, marginTop: 4 },
  fileList: { marginTop: 10, display: "flex", flexDirection: "column", gap: 6 },
  fileItem: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#E6F1FB",
    border: "0.5px solid #B5D4F4",
    borderRadius: 7, padding: "7px 10px",
    fontSize: 12,
    animation: "rowIn 0.25s ease both",
  },
  fileIcon: { color: "#185FA5", flexShrink: 0 },
  fileName: { flex: 1, color: "#042C53", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  fileSize: { color: "#185FA5", flexShrink: 0, opacity: 0.8 },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#185FA5", opacity: 0.6, padding: 0, lineHeight: 1,
    fontSize: 14, flexShrink: 0,
  },
  submitBtn: {
    width: "100%", padding: "10px 16px",
    fontSize: 13, fontWeight: 500,
    borderRadius: 8, border: "none", cursor: "pointer",
    background: "#185FA5", color: "#E6F1FB",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
    marginTop: 4,
  },
};

function DeviceIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
}
function LockIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function EyeIcon({ off }) {
  return off
    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function UploadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
}
function FileIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadForm({ onUpload }) {
  const [deviceId, setDeviceId] = useState("phoneA");
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const fileRef = useRef(null);

  const addFiles = useCallback((incoming) => {
    const arr = Array.from(incoming);
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...arr.filter((f) => !names.has(f.name))];
    });
  }, []);

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length || loading) return;
    setLoading(true);
    try { await onUpload?.({ deviceId, pin, files }); }
    finally { setLoading(false); }
  };

  const focusStyle = (field) => focusField === field
    ? { borderColor: "#378ADD", boxShadow: "0 0 0 3px rgba(55,138,221,0.15)" } : {};

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <form style={styles.panel} onSubmit={handleSubmit}>
        <p style={styles.title}>
          <span style={styles.dot} />
          Upload Backup
        </p>

        <div style={styles.grid}>
          {/* Device ID */}
          <div>
            <label style={styles.label} htmlFor="deviceId">Device ID</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}><DeviceIcon /></span>
              <input
                id="deviceId" value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="phoneA"
                onFocus={() => setFocusField("deviceId")}
                onBlur={() => setFocusField(null)}
                style={{ ...styles.input, ...focusStyle("deviceId") }}
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label style={styles.label} htmlFor="pin">PIN</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}><LockIcon /></span>
              <input
                id="pin" value={pin}
                type={showPin ? "text" : "password"}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                onFocus={() => setFocusField("pin")}
                onBlur={() => setFocusField(null)}
                style={{ ...styles.input, paddingRight: 32, ...focusStyle("pin") }}
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPin((v) => !v)} tabIndex={-1}>
                <EyeIcon off={showPin} />
              </button>
            </div>
          </div>

          {/* Dropzone */}
          <div style={styles.fieldFull}>
            <label style={styles.label}>Backup Files</label>
            <div
              style={{
                ...styles.dropzone,
                borderColor: dragging ? "#378ADD" : "var(--color-border-secondary)",
                background: dragging ? "#E6F1FB" : "var(--color-background-secondary)",
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <div style={styles.dropIcon}><UploadIcon /></div>
              <p style={styles.dropLabel}>
                {dragging ? "Drop files here" : "Drag & drop or click to browse"}
              </p>
              <p style={styles.dropSub}>Any file type · Multiple allowed</p>
              <input ref={fileRef} type="file" multiple style={{ display: "none" }}
                onChange={(e) => addFiles(e.target.files || [])} />
            </div>

            {files.length > 0 && (
              <div style={styles.fileList}>
                {files.map((f, i) => (
                  <div key={f.name} style={{ ...styles.fileItem, animationDelay: `${i * 0.05}s` }}>
                    <span style={styles.fileIcon}><FileIcon /></span>
                    <span style={styles.fileName}>{f.name}</span>
                    <span style={styles.fileSize}>{fmt(f.size)}</span>
                    <button type="button" style={styles.removeBtn} onClick={() => removeFile(f.name)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!files.length || loading}
          style={{
            ...styles.submitBtn,
            background: !files.length || loading ? "#B5D4F4" : "#185FA5",
            cursor: !files.length || loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (files.length && !loading) e.currentTarget.style.background = "#0C447C"; }}
          onMouseLeave={(e) => { if (files.length && !loading) e.currentTarget.style.background = "#185FA5"; }}
        >
          {loading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Uploading…
            </>
          ) : (
            <><UploadIcon /> Upload Backup</>
          )}
        </button>
      </form>
    </>
  );
}
