import React, { useState, useEffect } from 'react';
import NotesList from '../components/NotesList';
import Editor from '../components/Editor';
import AIFeatures from '../components/AIFeatures';
import CryptoJS from 'crypto-js';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [search, setSearch] = useState('');
  const [apiKey, setApiKey] = useState(typeof window !== 'undefined' ? localStorage.getItem('groqApiKey') || '' : '');

  useEffect(() => {
    const storedNotes = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('notes')) || [] : [];
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('groqApiKey', apiKey);
    }
  }, [apiKey]);

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '<p></p>',
      pinned: false,
      encrypted: false,
      encryptedContent: null,
    };
    setNotes([...notes, newNote]);
    setCurrentNoteId(newNote.id);
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => (note.id === id ? { ...note, ...updates } : note)));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (currentNoteId === id) setCurrentNoteId(null);
  };

  const togglePin = (id) => {
    const note = notes.find(n => n.id === id);
    updateNote(id, { pinned: !note.pinned });
  };

  const encryptNote = (id, password) => {
    const note = notes.find(n => n.id === id);
    const encrypted = CryptoJS.AES.encrypt(note.content, password).toString();
    updateNote(id, { encrypted: true, encryptedContent: encrypted, content: '' });
  };

  const decryptNote = (id, password) => {
    const note = notes.find(n => n.id === id);
    try {
      const decrypted = CryptoJS.AES.decrypt(note.encryptedContent, password).toString(CryptoJS.enc.Utf8);
      updateNote(id, { encrypted: false, encryptedContent: null, content: decrypted });
      return true;
    } catch (e) {
      alert('Wrong password');
      return false;
    }
  };

  const currentNote = notes.find(note => note.id === currentNoteId);
  const filteredNotes = notes
    .filter(note => note.title.toLowerCase().includes(search.toLowerCase()) || note.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full md:w-1/4 p-4 border-r border-gray-300 overflow-y-auto">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={createNote} className="w-full p-2 bg-blue-500 text-white rounded mb-4">
          New Note
        </button>
        <NotesList
          notes={filteredNotes}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          togglePin={togglePin}
          deleteNote={deleteNote}
        />
      </div>
      <div className="flex-1 p-4">
        {!apiKey && (
          <div className="mb-4">
            <label className="block mb-1">Groq API Key:</label>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {currentNote && (
          <>
            <input
              type="text"
              value={currentNote.title}
              onChange={e => updateNote(currentNoteId, { title: e.target.value })}
              placeholder="Note Title"
              className="w-full p-2 mb-4 text-xl border rounded"
            />
            {currentNote.encrypted ? (
              <div className="mb-4">
                <p>Note is encrypted. Enter password:</p>
                <input type="password" id="decrypt-pass" className="p-2 border rounded mr-2" />
                <button
                  onClick={() => {
                    const pass = document.getElementById('decrypt-pass').value;
                    decryptNote(currentNoteId, pass);
                  }}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Decrypt
                </button>
              </div>
            ) : (
              <>
                <Editor content={currentNote.content} onChange={content => updateNote(currentNoteId, { content })} />
                <AIFeatures
                  content={currentNote.content}
                  apiKey={apiKey}
                  onGlossary={highlightedContent => updateNote(currentNoteId, { content: highlightedContent })}
                  onGrammar={highlightedContent => updateNote(currentNoteId, { content: highlightedContent })}
                />
                <button
                  onClick={() => {
                    const pass = prompt('Enter password to encrypt:');
                    if (pass) encryptNote(currentNoteId, pass);
                  }}
                  className="mt-4 p-2 bg-red-500 text-white rounded"
                >
                  Encrypt Note
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}