import { midiNoteToFrequency } from './midiNoteToFrequency'


// estamos a usar o bagulho q ja eh global "AudioContext"

let audioContext: AudioContext | undefined

export async function playTestTone(noteNumber: number) {
    // Your implementation goes here

    if (audioContext === undefined) {
        // n tem q botar const ou let na frente. a variavel ja existia antes lerdao. Tu tava shadowing.
        audioContext = new AudioContext()
    }

    if (audioContext.state === 'suspended') {
        await audioContext.resume() // the ? like audioContext?.resume() is useful when you are not sure if something exists apparently
    }

    // Create oscillator and gain node
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.frequency.setValueAtTime(midiNoteToFrequency(noteNumber), audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.5)

}