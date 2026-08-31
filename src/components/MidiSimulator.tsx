import { useEffect } from 'react';
import { midiToFullNoteName } from '../music/notes';

interface MidiSimulatorProps {
  pressedNotes: number[];
  onNoteOff: (noteNumber: number) => void;
  onNoteOn: (noteNumber: number, velocity?: number) => void;
}

const SIMULATOR_KEYS = [
  { key: 'a', note: 60 },
  { key: 'w', note: 61 },
  { key: 's', note: 62 },
  { key: 'e', note: 63 },
  { key: 'd', note: 64 },
  { key: 'f', note: 65 },
  { key: 't', note: 66 },
  { key: 'g', note: 67 },
  { key: 'y', note: 68 },
  { key: 'h', note: 69 },
  { key: 'u', note: 70 },
  { key: 'j', note: 71 },
  { key: 'k', note: 72 },
];

const SIMULATOR_NOTES = SIMULATOR_KEYS.map(({ note }) => note);
const KEY_TO_NOTE = new Map(SIMULATOR_KEYS.map(({ key, note }) => [key, note]));

export function MidiSimulator({ pressedNotes, onNoteOff, onNoteOn }: MidiSimulatorProps) {
  const pressedNoteSet = new Set(pressedNotes);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      const note = KEY_TO_NOTE.get(event.key.toLowerCase());

      if (note === undefined) {
        return;
      }

      event.preventDefault();
      onNoteOn(note);
    }

    function handleKeyUp(event: KeyboardEvent) {
      const note = KEY_TO_NOTE.get(event.key.toLowerCase());

      if (note === undefined) {
        return;
      }

      event.preventDefault();
      onNoteOff(note);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNoteOff, onNoteOn]);

  return (
    <section className="panel">
      <h2>Manual Simulator</h2>
      <p className="simulator-help">Use A W S E D F T G Y H U J K as a one-octave keyboard.</p>
      <div className="simulator-grid">
        {SIMULATOR_NOTES.map((note) => {
          const isPressed = pressedNoteSet.has(note);
          const assignedKey = SIMULATOR_KEYS.find((simKey) => simKey.note === note)?.key.toUpperCase();

          return (
            <button
              className={isPressed ? 'sim-note active' : 'sim-note'}
              key={note}
              type="button"
              onMouseDown={() => onNoteOn(note)}
              onMouseUp={() => onNoteOff(note)}
              onMouseLeave={() => {
                if (isPressed) {
                  onNoteOff(note);
                }
              }}
              onTouchStart={(event) => {
                event.preventDefault();
                onNoteOn(note);
              }}
              onTouchEnd={() => onNoteOff(note)}
            >
              {midiToFullNoteName(note)}
              <small>{assignedKey} / {note}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
