interface MIDIAccess extends EventTarget {
  readonly inputs: MIDIInputMap;
  readonly outputs: MIDIOutputMap;
  readonly sysexEnabled: boolean;
  onstatechange: ((event: MIDIConnectionEvent) => void) | null;
}

interface MIDIInputMap extends ReadonlyMap<string, MIDIInput> {}

interface MIDIOutputMap extends ReadonlyMap<string, MIDIOutput> {}

interface MIDIPort extends EventTarget {
  readonly id: string;
  readonly manufacturer?: string;
  readonly name?: string;
  readonly type: 'input' | 'output';
  readonly version?: string;
  readonly state: 'connected' | 'disconnected';
  readonly connection: 'open' | 'closed' | 'pending';
}

interface MIDIInput extends MIDIPort {
  readonly type: 'input';
  onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

interface MIDIOutput extends MIDIPort {
  readonly type: 'output';
}

interface MIDIMessageEvent extends Event {
  readonly data: Uint8Array;
}

interface MIDIConnectionEvent extends Event {
  readonly port: MIDIPort;
}

interface Navigator {
  requestMIDIAccess?: (options?: { sysex?: boolean }) => Promise<MIDIAccess>;
}
