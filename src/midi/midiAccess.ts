import type { MidiInputDevice } from './midiTypes';

export function isWebMidiSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function';
}

export async function requestMidiAccess(): Promise<MIDIAccess> {
  if (!isWebMidiSupported() || !navigator.requestMIDIAccess) {
    throw new Error('Web MIDI is not supported in this browser.');
  }

  return navigator.requestMIDIAccess({ sysex: false });
}

export function getMidiInputDevices(access: MIDIAccess): MidiInputDevice[] {
  return Array.from(access.inputs.values()).map((input) => ({
    id: input.id,
    name: input.name || 'Unnamed MIDI input',
    manufacturer: input.manufacturer || undefined,
    state: input.state,
    connection: input.connection,
  }));
}
