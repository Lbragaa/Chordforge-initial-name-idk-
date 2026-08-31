export type MidiConnectionStatus = 'unsupported' | 'idle' | 'requesting' | 'connected' | 'error';

export type MidiEventType = 'note-on' | 'note-off';

export interface MidiInputDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: MIDIPort['state'];
  connection: MIDIPort['connection'];
}

export interface MidiNoteEvent {
  id: string;
  timestamp: string;
  type: MidiEventType;
  noteNumber: number;
  noteName: string;
  velocity: number;
  source: string;
}

export interface ParsedMidiMessage {
  type: MidiEventType;
  noteNumber: number;
  velocity: number;
}
