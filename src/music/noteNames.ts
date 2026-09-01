// Not exported because we dont want to expose this
const noteNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

// Function for midiNoteToName
export function midiNoteToName(noteNumber: number): string {
  const noteIndex = noteNumber % 12 // (makes sense)
  const octave = Math.floor(noteNumber / 12) - 1 // this is the math for the octave apparently
  const noteName = noteNames[noteIndex]

  return `${noteName}${octave}` // the $ is for formatting strings apparently?
}