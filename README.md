# Chordforge

Chordforge is a browser-based MIDI-powered harmony trainer/game prototype.

The first milestone is intentionally small: connect to a MIDI keyboard in a supported browser, display currently pressed notes, and show a debug log of recent note-on/note-off events.

## Stack

- React
- TypeScript
- Vite
- Web MIDI API

This is a browser-only prototype. There is no backend, database, authentication, or game system yet.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Browser Notes

Web MIDI is best supported in desktop Chrome and Edge. Safari and many mobile browsers do not support this prototype's hardware MIDI input path.
