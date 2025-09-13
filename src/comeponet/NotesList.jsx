export default function NotesList({ notes, onSelect, activeId, onDelete, onPin }) {
  return (
    <div>
      {notes.length === 0 && <div>No notes yet.</div>}
      {notes.map(n => (
        <div
          key={n.id}
          style={{
            padding: "6px",
            marginBottom: "6px",
            borderRadius: "6px",
            background: activeId === n.id ? "#334155" : "#0f172a",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
          }}
          onClick={() => onSelect(n.id)}
        >
          <div>
            <b>{n.title || "Untitled"}</b>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              {(n.content || "").replace(/<[^>]+>/g, "").slice(0, 40)}
            </div>
          </div>
          <div>
            <button
              onClick={e => {
                e.stopPropagation();
                onPin(n.id);
              }}
            >
              📌
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                if (confirm("Delete?")) onDelete(n.id);
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
