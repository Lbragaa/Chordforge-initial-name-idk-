import { useSimpleSynth } from '../audio/useSimpleSynth';
import { AudioStatus } from '../components/AudioStatus';
import { MidiDeviceList } from '../components/MidiDeviceList';
import { MidiEventLog } from '../components/MidiEventLog';
import { MidiSimulator } from '../components/MidiSimulator';
import { MidiStatus } from '../components/MidiStatus';
import { PressedNotesDisplay } from '../components/PressedNotesDisplay';
import { useMidiInput } from '../midi/useMidiInput';

export function App() {
  const midi = useMidiInput();
  const synth = useSimpleSynth(midi.pressedNotes);

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">First MIDI prototype</p>
        <h1>Chordforge</h1>
        <p>
          Connect a MIDI keyboard or use the simulator to verify live note input, note names, and recent events.
        </p>
      </header>

      <div className="dashboard">
        <MidiStatus status={midi.status} errorMessage={midi.errorMessage} onConnect={midi.connect} />
        <AudioStatus status={synth.status} errorMessage={synth.errorMessage} onEnableAudio={synth.enableAudio} />
        <PressedNotesDisplay pressedNotes={midi.pressedNotes} />
        <MidiDeviceList devices={midi.devices} />
        <MidiSimulator
          pressedNotes={midi.pressedNotes}
          onNoteOn={midi.simulateNoteOn}
          onNoteOff={midi.simulateNoteOff}
        />
        <MidiEventLog events={midi.eventLog} />
      </div>
    </main>
  );
}
