import { useState } from "react";

const SAMPLE_FILES = [
  { file_name: "project_report.pdf", size: "2.4 MB", time: "2025-03-28 10:32" },
  { file_name: "design_assets.zip", size: "15.8 MB", time: "2025-03-27 14:15" },
  { file_name: "meeting_notes.docx", size: "340 KB", time: "2025-03-26 09:45" },
  { file_name: "data_export.csv", size: "1.1 MB", time: "2025-03-25 16:20" },
];

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

export default function FileList({ files = SAMPLE_FILES, emptyText = "No files stored yet." }) {
  const [hovered, setHovered] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...files].sort((a, b) => {
    if (!sortKey) return 0;
    const va = a[sortKey] ?? "";
    const vb = b[sortKey] ?? "";
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const SortArrow = ({ col }) => {
    if (sortKey !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4, color: "#1D9E75" }}>{sortAsc ? "↑" : "↓"}</span>;
  };

  const styles = {
    panel: {
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "12px",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
      animation: "fadeInUp 0.4s ease both",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      background: "var(--color-background-secondary)",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      color: "var(--color-text-primary)",
    },
    dot: {
      width: 7, height: 7,
      borderRadius: "50%",
      background: "#1D9E75",
      boxShadow: "0 0 0 3px rgba(29,158,117,0.15)",
      animation: "pulse 2s ease-in-out infinite",
      flexShrink: 0,
    },
    badge: {
      fontSize: 11,
      fontWeight: 500,
      color: "#0F6E56",
      background: "#E1F5EE",
      padding: "3px 9px",
      borderRadius: 20,
    },
    tableWrap: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: {
      padding: "10px 20px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 500,
      color: "var(--color-text-secondary)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: "var(--color-background-secondary)",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      cursor: "pointer",
      userSelect: "none",
      whiteSpace: "nowrap",
    },
    thRight: { textAlign: "right" },
    td: {
      padding: "11px 20px",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      color: "var(--color-text-primary)",
      transition: "background 0.15s ease",
    },
    tdMuted: {
      color: "var(--color-text-secondary)",
      fontVariantNumeric: "tabular-nums",
      textAlign: "right",
    },
    nameCell: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    iconWrap: {
      width: 28, height: 28,
      borderRadius: 6,
      background: "#E1F5EE",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#0F6E56",
      flexShrink: 0,
    },
    fileName: { fontWeight: 500 },
    empty: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "48px 20px",
      color: "var(--color-text-secondary)",
      fontSize: 13,
      animation: "fadeInUp 0.4s ease both",
    },
    emptyIcon: {
      width: 40, height: 40,
      borderRadius: 10,
      background: "var(--color-background-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-text-secondary)",
    },
  };

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
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <section style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.dot} />
            Stored Files
          </div>
          {files.length > 0 && (
            <span style={styles.badge}>{files.length} file{files.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {sorted.length ? (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[["file_name", "Name"], ["size", "Size"], ["time", "Time"]].map(([key, label]) => (
                    <th
                      key={key}
                      style={{ ...styles.th, ...(key !== "file_name" ? styles.thRight : {}) }}
                      onClick={() => handleSort(key)}
                    >
                      {label}<SortArrow col={key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((file, i) => (
                  <tr
                    key={`${file.file_name}-${file.time}`}
                    style={{ animation: `rowIn 0.3s ease ${i * 0.05}s both`, cursor: "default" }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {["file_name", "size", "time"].map((col) => (
                      <td
                        key={col}
                        style={{
                          ...styles.td,
                          ...(col !== "file_name" ? styles.tdMuted : {}),
                          background: hovered === i ? "var(--color-background-secondary)" : "transparent",
                          ...(i === sorted.length - 1 ? { borderBottom: "none" } : {}),
                        }}
                      >
                        {col === "file_name" ? (
                          <div style={styles.nameCell}>
                            <div style={styles.iconWrap}><FileIcon /></div>
                            <span style={styles.fileName}>{file.file_name}</span>
                          </div>
                        ) : (
                          file[col] ?? <span style={{ opacity: 0.35 }}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}><FolderIcon /></div>
            <span>{emptyText}</span>
          </div>
        )}
      </section>
    </>
  );
}
