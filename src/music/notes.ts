const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export function midiToPitchClass(midiNote: number): number {
  return ((midiNote % 12) + 12) % 12;
}

export function midiToOctave(midiNote: number): number {
  return Math.floor(midiNote / 12) - 1;
}

export function midiToNoteName(midiNote: number): string {
  return NOTE_NAMES[midiToPitchClass(midiNote)];
}

export function midiToFullNoteName(midiNote: number): string {
  return `${midiToNoteName(midiNote)}${midiToOctave(midiNote)}`;
}

export function midiToFrequency(midiNote: number): number {
  return 440 * 2 ** ((midiNote - 69) / 12);
}
