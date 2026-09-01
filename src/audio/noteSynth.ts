import { midiNoteToFrequency } from './midiNoteToFrequency'


// estamos a usar o bagulho q ja eh global "AudioContext"

let audioContext: AudioContext | undefined

//ActiveVoice type pra ter as parada ai pra ser lembrada num map algo assim.
type ActiveVoice = {
    oscillator: OscillatorNode
    gainNode: GainNode
}

const activeVoices = new Map<number, ActiveVoice>()

export async function startNote(noteNumber: number) {
    // Your implementation goes here

    if (audioContext === undefined) {
        // n tem q botar const ou let na frente. a variavel ja existia antes lerdao. Tu tava shadowing.
        audioContext = new AudioContext()
    }

    if (audioContext.state === 'suspended') {
        await audioContext.resume() // the ? like audioContext?.resume() is useful when you are not sure if something exists apparently
    }

    // Create oscillator and gain node

    // Put the check here. If the note we just attempted is already playing, we dont play it over again.
    if (activeVoices.has(noteNumber)) {
        return
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.frequency.setValueAtTime(midiNoteToFrequency(noteNumber), audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Incluindo o noteNumber, com o respectivo oscillator and gainNode no activeVoices
    activeVoices.set(noteNumber, {
        oscillator,
        gainNode,
    })
    
    oscillator.start()
    // For now it wont necessarily stop.

}

export function stopNote(noteNumber: number) {
  const activeVoice = activeVoices.get(noteNumber) // Buscando a nota entregue

  if (activeVoice === undefined) {
    return
  }

  activeVoice.oscillator.stop()
  activeVoices.delete(noteNumber)
}