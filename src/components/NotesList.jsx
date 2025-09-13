import React from 'react';
import { FaPin, FaTrash } from 'react-icons/fa';

const NotesList = ({ notes, currentNoteId, setCurrentNoteId, togglePin, deleteNote }) => {
  return (
    <div>
      {notes.map(note => (
        <div
          key={note.id}
          className={`p-2 border-b flex justify-between items-center cursor-pointer ${note.id === currentNoteId ? 'bg-blue-100' : ''} ${note.pinned ? 'font-bold' : ''}`}
          onClick={() => setCurrentNoteId(note.id)}
        >
          <span>{note.title} {note.pinned && <FaPin className="inline ml-2" />}</span>
          <div>
            <button onClick={e => { e.stopPropagation(); togglePin(note.id); }} className="mr-2 text-blue-500">
              Pin
            </button>
            <button onClick={e => { e.stopPropagation(); deleteNote(note.id); }} className="text-red-500">
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;