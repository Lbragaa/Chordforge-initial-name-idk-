import type { MidiConnectionStatus } from '../midi/midiTypes';

interface MidiStatusProps {
  status: MidiConnectionStatus;
  errorMessage: string | null;
  onConnect: () => void;
}

const STATUS_LABELS: Record<MidiConnectionStatus, string> = {
  unsupported: 'Web MIDI unsupported',
  idle: 'Not connected',
  requesting: 'Requesting MIDI access...',
  connected: 'MIDI access connected',
  error: 'MIDI connection error',
};

export function MidiStatus({ status, errorMessage, onConnect }: MidiStatusProps) {
  const isDisabled = status === 'requesting' || status === 'unsupported';

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <h2>MIDI Connection</h2>
          <p className={`status status-${status}`}>{STATUS_LABELS[status]}</p>
        </div>
        <button type="button" onClick={onConnect} disabled={isDisabled}>
          Connect MIDI
        </button>
      </div>
      {status === 'unsupported' && (
        <p className="message">
          This browser does not expose Web MIDI. Use desktop Chrome or Edge for hardware MIDI input.
        </p>
      )}
      {errorMessage && <p className="message error">{errorMessage}</p>}
    </section>
  );
}
