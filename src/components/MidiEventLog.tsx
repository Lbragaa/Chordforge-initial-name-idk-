import type { MidiNoteEvent } from '../midi/midiTypes';

interface MidiEventLogProps {
  events: MidiNoteEvent[];
}

export function MidiEventLog({ events }: MidiEventLogProps) {
  return (
    <section className="panel">
      <h2>Debug Event Log</h2>
      {events.length === 0 ? (
        <p className="empty">Recent note-on and note-off events will appear here.</p>
      ) : (
        <div className="event-log" role="log" aria-live="polite">
          {events.map((event) => (
            <div className="event-row" key={event.id}>
              <span>{event.timestamp}</span>
              <strong>{event.type}</strong>
              <span>{event.noteName}</span>
              <span>MIDI {event.noteNumber}</span>
              <span>vel {event.velocity}</span>
              <span>{event.source}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
