import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { midiToFullNoteName } from '../music/notes';
import { getMidiInputDevices, isWebMidiSupported, requestMidiAccess } from './midiAccess';
import type { MidiConnectionStatus, MidiInputDevice, MidiNoteEvent, ParsedMidiMessage } from './midiTypes';

const MAX_LOG_ITEMS = 24;

function parseMidiMessage(data: Uint8Array | null): ParsedMidiMessage | null {
  if (!data) {
    return null;
  }

  const [statusByte, noteNumber, velocity = 0] = data;
  const command = statusByte & 0xf0;

  if (command === 0x90) {
    return {
      type: velocity > 0 ? 'note-on' : 'note-off',
      noteNumber,
      velocity,
    };
  }

  if (command === 0x80) {
    return {
      type: 'note-off',
      noteNumber,
      velocity,
    };
  }

  return null;
}

function formatTimestamp(date = new Date()): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function useMidiInput() {
  const [status, setStatus] = useState<MidiConnectionStatus>(() => (isWebMidiSupported() ? 'idle' : 'unsupported'));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MidiInputDevice[]>([]);
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);
  const [eventLog, setEventLog] = useState<MidiNoteEvent[]>([]);
  const midiAccessRef = useRef<MIDIAccess | null>(null);
  const eventIdRef = useRef(0);

  const addLogEntry = useCallback((event: Omit<MidiNoteEvent, 'id' | 'timestamp'>) => {
    setEventLog((current) => [
      {
        ...event,
        id: `${Date.now()}-${eventIdRef.current++}`,
        timestamp: formatTimestamp(),
      },
      ...current,
    ].slice(0, MAX_LOG_ITEMS));
  }, []);

  const applyNoteEvent = useCallback((event: Omit<MidiNoteEvent, 'id' | 'timestamp' | 'noteName'>) => {
    setPressedNotes((current) => {
      if (event.type === 'note-on') {
        return Array.from(new Set([...current, event.noteNumber])).sort((a, b) => a - b);
      }

      return current.filter((note) => note !== event.noteNumber);
    });

    addLogEntry({
      ...event,
      noteName: midiToFullNoteName(event.noteNumber),
    });
  }, [addLogEntry]);

  const refreshDevices = useCallback((access: MIDIAccess) => {
    setDevices(getMidiInputDevices(access));
  }, []);

  const attachInputHandlers = useCallback((access: MIDIAccess) => {
    access.inputs.forEach((input) => {
      input.onmidimessage = (message) => {
        const parsed = parseMidiMessage(message.data);

        if (!parsed) {
          return;
        }

        applyNoteEvent({
          ...parsed,
          source: input.name || 'MIDI input',
        });
      };
    });
  }, [applyNoteEvent]);

  const connect = useCallback(async () => {
    if (!isWebMidiSupported()) {
      setStatus('unsupported');
      setErrorMessage('This browser does not support Web MIDI. Try desktop Chrome or Edge.');
      return;
    }

    setStatus('requesting');
    setErrorMessage(null);

    try {
      const access = await requestMidiAccess();
      midiAccessRef.current = access;
      refreshDevices(access);
      attachInputHandlers(access);

      access.onstatechange = () => {
        refreshDevices(access);
        attachInputHandlers(access);
      };

      setStatus('connected');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Could not request MIDI access.');
    }
  }, [attachInputHandlers, refreshDevices]);

  const simulateNoteOn = useCallback((noteNumber: number, velocity = 100) => {
    applyNoteEvent({
      type: 'note-on',
      noteNumber,
      velocity,
      source: 'Simulator',
    });
  }, [applyNoteEvent]);

  const simulateNoteOff = useCallback((noteNumber: number) => {
    applyNoteEvent({
      type: 'note-off',
      noteNumber,
      velocity: 0,
      source: 'Simulator',
    });
  }, [applyNoteEvent]);

  useEffect(() => {
    return () => {
      const access = midiAccessRef.current;

      if (!access) {
        return;
      }

      access.inputs.forEach((input) => {
        input.onmidimessage = null;
      });

      access.onstatechange = null;
    };
  }, []);

  return useMemo(() => ({
    connect,
    devices,
    errorMessage,
    eventLog,
    pressedNotes,
    simulateNoteOff,
    simulateNoteOn,
    status,
  }), [connect, devices, errorMessage, eventLog, pressedNotes, simulateNoteOff, simulateNoteOn, status]);
}
