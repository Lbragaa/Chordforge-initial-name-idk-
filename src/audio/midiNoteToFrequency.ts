export function midiNoteToFrequency(noteNumber: number): number {
    // Considerando afinacao A = 440hz
    return 440 * 2 ** ((noteNumber - 69) / 12)
}