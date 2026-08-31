import type { MidiInputDevice } from '../midi/midiTypes';

interface MidiDeviceListProps {
  devices: MidiInputDevice[];
}

export function MidiDeviceList({ devices }: MidiDeviceListProps) {
  return (
    <section className="panel">
      <h2>MIDI Inputs</h2>
      {devices.length === 0 ? (
        <p className="empty">No MIDI input devices found yet. Connect a keyboard, then click Connect MIDI again if needed.</p>
      ) : (
        <ul className="device-list">
          {devices.map((device) => (
            <li key={device.id}>
              <strong>{device.name}</strong>
              <span>{device.manufacturer || 'Unknown manufacturer'}</span>
              <span>{device.state} / {device.connection}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
