import { midiToFullNoteName } from '../music/notes';

interface PressedNotesDisplayProps {
  pressedNotes: number[];
}

export function PressedNotesDisplay({ pressedNotes }: PressedNotesDisplayProps) {
  return (
    <section className="panel pressed-panel">
      <h2>Pressed Notes</h2>
      {pressedNotes.length === 0 ? (
        <p className="empty">No notes are currently pressed.</p>
      ) : (
        <div className="pressed-notes">
          {pressedNotes.map((note) => (
            <span className="note-pill" key={note}>
              {midiToFullNoteName(note)}
              <small>{note}</small>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
