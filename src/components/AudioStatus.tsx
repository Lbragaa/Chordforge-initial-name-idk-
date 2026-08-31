interface AudioStatusProps {
  errorMessage: string | null;
  onEnableAudio: () => void;
  status: 'unsupported' | 'idle' | 'running' | 'suspended' | 'error';
}

const AUDIO_STATUS_LABELS: Record<AudioStatusProps['status'], string> = {
  unsupported: 'Web Audio unsupported',
  idle: 'Sound off',
  running: 'Sound on',
  suspended: 'Sound suspended',
  error: 'Audio error',
};

export function AudioStatus({ errorMessage, onEnableAudio, status }: AudioStatusProps) {
  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <h2>Sound</h2>
          <p className={`status status-${status}`}>{AUDIO_STATUS_LABELS[status]}</p>
        </div>
        <button type="button" onClick={onEnableAudio} disabled={status === 'unsupported' || status === 'running'}>
          Enable Sound
        </button>
      </div>
      <p className="message">Uses a simple built-in browser synth for now. Real instrument sounds can come later.</p>
      {errorMessage && <p className="message error">{errorMessage}</p>}
    </section>
  );
}
