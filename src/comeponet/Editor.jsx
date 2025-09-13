"use client";
import { useState, useEffect, useRef } from "react";
import { encryptText, decryptText } from "@/lib/storage";
import { analyzeNoteAI } from "@/lib/ai";

export default function Editor({ notes, activeId, onUpdate }) {
  const active = notes.find(n => n.id === activeId) || null;
  const [title, setTitle] = useState(active ? active.title : "");
  const [content, setContent] = useState(active ? active.content : "");
  const [pw, setPw] = useState("");
  const editorRef = useRef();

  useEffect(() => {
    if (active) {
      setTitle(active.title);
      setContent(active.content);
    }
  }, [activeId]);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => onUpdate(active.id, { title, content }), 400);
    return () => clearTimeout(t);
  }, [title, content]);

  function format(cmd, val) {
    document.execCommand(cmd, false, val);
    setContent(editorRef.current.innerHTML);
  }

  async function aiEnhance() {
    if (!active) return alert("Select a note first");
    const plain = editorRef.current.innerText || "";
    const res = await analyzeNoteAI(plain);
    if (res) alert("AI Summary:\n" + res.summary);
  }

  function saveEncrypted() {
    if (!active || !pw) return alert("Password required");
    const cipher = encryptText(editorRef.current.innerHTML, pw);
    onUpdate(active.id, { content: cipher, encrypted: true });
    setPw("");
    alert("Note encrypted.");
  }

  function unlockNote() {
    if (!active || !pw) return;
    const plain = decryptText(active.content, pw);
    if (!plain) return alert("Wrong password.");
    onUpdate(active.id, { content: plain, encrypted: false });
    setPw("");
  }

  return active ? (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title..."
        style={{ marginBottom: "6px" }}
      />
      <div>
        <button onClick={() => format("bold")}>B</button>
        <button onClick={() => format("italic")}>I</button>
        <button onClick={() => format("underline")}>U</button>
        <button onClick={aiEnhance}>AI Enhance</button>
        <input
          placeholder="Password"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />
        {active.encrypted ? (
          <button onClick={unlockNote}>Unlock</button>
        ) : (
          <button onClick={saveEncrypted}>Encrypt</button>
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable={!active.encrypted}
        style={{
          flex: 1,
          border: "1px solid #475569",
          borderRadius: "6px",
          padding: "6px",
          marginTop: "6px",
        }}
        dangerouslySetInnerHTML={{
          __html: active.encrypted ? "<i>Encrypted note</i>" : active.content,
        }}
        onInput={() => setContent(editorRef.current.innerHTML)}
      />
    </div>
  ) : (
    <div>Select or create a note</div>
  );
}
