import { useCallback, useEffect, useRef, useState } from 'react';
import { midiToFrequency } from '../music/notes';

type AudioStatus = 'unsupported' | 'idle' | 'running' | 'suspended' | 'error';

interface ActiveVoice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

function getAudioContextConstructor() {
  return window.AudioContext || window.webkitAudioContext;
}

export function useSimpleSynth(pressedNotes: number[]) {
  const [status, setStatus] = useState<AudioStatus>(() => (getAudioContextConstructor() ? 'idle' : 'unsupported'));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeVoicesRef = useRef<Map<number, ActiveVoice>>(new Map());

  const stopNote = useCallback((noteNumber: number) => {
    const context = audioContextRef.current;
    const voice = activeVoicesRef.current.get(noteNumber);

    if (!context || !voice) {
      return;
    }

    const stopTime = context.currentTime + 0.04;
    voice.gain.gain.cancelScheduledValues(context.currentTime);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, context.currentTime);
    voice.gain.gain.linearRampToValueAtTime(0.0001, stopTime);
    voice.oscillator.stop(stopTime);
    activeVoicesRef.current.delete(noteNumber);
  }, []);

  const stopAllNotes = useCallback(() => {
    Array.from(activeVoicesRef.current.keys()).forEach(stopNote);
  }, [stopNote]);

  const startNote = useCallback((noteNumber: number) => {
    const context = audioContextRef.current;

    if (!context || context.state !== 'running' || activeVoicesRef.current.has(noteNumber)) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(midiToFrequency(noteNumber), now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);

    activeVoicesRef.current.set(noteNumber, { oscillator, gain });
  }, []);

  const enableAudio = useCallback(async () => {
    const AudioContextConstructor = getAudioContextConstructor();

    if (!AudioContextConstructor) {
      setStatus('unsupported');
      setErrorMessage('This browser does not support Web Audio.');
      return;
    }

    try {
      const context = audioContextRef.current || new AudioContextConstructor();
      audioContextRef.current = context;

      if (context.state !== 'running') {
        await context.resume();
      }

      setStatus(context.state === 'running' ? 'running' : 'suspended');
      setErrorMessage(null);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Could not start browser audio.');
    }
  }, []);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const nextNotes = new Set(pressedNotes);

    pressedNotes.forEach(startNote);
    Array.from(activeVoicesRef.current.keys()).forEach((noteNumber) => {
      if (!nextNotes.has(noteNumber)) {
        stopNote(noteNumber);
      }
    });
  }, [pressedNotes, startNote, status, stopNote]);

  useEffect(() => {
    return () => {
      stopAllNotes();
      void audioContextRef.current?.close();
    };
  }, [stopAllNotes]);

  return {
    enableAudio,
    errorMessage,
    status,
  };
}
