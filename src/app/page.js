"use client";
import { useEffect, useState } from "react";
import NotesList from "@/components/NotesList";
import Editor from "@/components/Editor";
import { loadNotes, saveNotes, uid } from "@/lib/storage";

export default function Page() {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  function createNote() {
    const n = {
      id: uid(),
      title: "Untitled",
      content: "",
      pinned: false,
      created: Date.now(),
      encrypted: false,
    };
    setNotes([n, ...notes]);
    setActiveId(n.id);
  }

  function updateNote(id, patch) {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...patch } : n)));
  }

  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function togglePin(id) {
    setNotes(prev =>
      prev
        .map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n))
        .sort((a, b) => b.pinned - a.pinned || b.created - a.created)
    );
  }

  const filtered = notes.filter(n =>
    (n.title + " " + n.content).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh", gap: "12px", padding: "12px" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          background: "#1e293b",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>AI Notes</h2>
        <input
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            padding: "6px",
            marginBottom: "8px",
            borderRadius: "6px",
            border: "none",
            width: "100%",
          }}
        />
        <button onClick={createNote} style={{ marginBottom: "8px", padding: "6px" }}>
          + New
        </button>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <NotesList
            notes={filtered}
            onSelect={setActiveId}
            activeId={activeId}
            onDelete={deleteNote}
            onPin={togglePin}
          />
        </div>
      </div>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          background: "#1e293b",
          borderRadius: "8px",
          padding: "8px",
        }}
      >
        <Editor
          notes={notes}
          activeId={activeId}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onPin={togglePin}
          onCreate={createNote}
        />
      </div>
    </div>
  );
}
