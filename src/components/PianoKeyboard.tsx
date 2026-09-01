import { midiNoteToName } from '../music/noteNames'
import './PianoKeyboard.css'

type PianoKeyboardProps = {
  // App owns this list and sends it here as a prop. This component only reads it.
  pressedNotes: number[]
  // This moves the displayed C4-C5 key data into App's selected octave.
  noteOffset: number
}

// A type describes which properties every object of this kind must have.
type WhitePianoKey = {
  noteNumber: number
  keyboardLabel: string
}

// Here, & is a TypeScript intersection (not a bitwise operation): a black key
// must have both WhitePianoKey's properties AND its own leftPosition property.
type BlackPianoKey = WhitePianoKey & {
  leftPosition: number
}

// These arrays separate the piano's data from its HTML-like JSX.
// Instead of manually writing thirteen nearly identical <div> elements,
// we describe the keys once as data and let React generate the elements.
// WhitePianoKey[] tells TypeScript that every item has noteNumber and keyboardLabel.
const whiteKeys: WhitePianoKey[] = [
  { noteNumber: 60, keyboardLabel: 'A' },
  { noteNumber: 62, keyboardLabel: 'S' },
  { noteNumber: 64, keyboardLabel: 'D' },
  { noteNumber: 65, keyboardLabel: 'F' },
  { noteNumber: 67, keyboardLabel: 'G' },
  { noteNumber: 69, keyboardLabel: 'H' },
  { noteNumber: 71, keyboardLabel: 'J' },
  { noteNumber: 72, keyboardLabel: 'K' },
]

// Black keys also need a horizontal position because they sit over the white keys.
const blackKeys: BlackPianoKey[] = [
  { noteNumber: 61, keyboardLabel: 'W', leftPosition: 12.5 },
  { noteNumber: 63, keyboardLabel: 'E', leftPosition: 25 },
  { noteNumber: 66, keyboardLabel: 'T', leftPosition: 50 },
  { noteNumber: 68, keyboardLabel: 'Y', leftPosition: 62.5 },
  { noteNumber: 70, keyboardLabel: 'U', leftPosition: 75 },
]

// We could've received the complete props object like this:
// export function PianoKeyboard(props: PianoKeyboardProps) {
//   const pressedNotes = props.pressedNotes
//   // ...
// }
// The shorter version below destructures it immediately: take the pressedNotes
// property from the props object and create a local variable with that value.
export function PianoKeyboard({ pressedNotes, noteOffset }: PianoKeyboardProps) {
  return (
    // A div is a generic container. CSS turns this otherwise plain container
    // into the frame that holds the white and black piano keys.
    <div className="piano-keyboard" aria-hidden="true">
      <div className="piano-keyboard__white-keys">
        {/* map gives this function one array item at a time. We chose the local
            name pianoKey; during each turn it has that item's properties. */}
        {whiteKeys.map((pianoKey) => {
          const displayedNoteNumber = pianoKey.noteNumber + noteOffset
          // true when App's pressedNotes list contains this key's MIDI number.
          const isPressed = pressedNotes.includes(displayedNoteNumber)

          return (
            <div
              // The first two classes are always present. When isPressed is
              // true, the ternary adds the class that activates pressed CSS.
              className={`piano-key piano-key--white${isPressed ? ' piano-key--pressed' : ''}`}
              // React uses this unique value to keep track of this list item.
              key={displayedNoteNumber}
            >
              <span className="piano-key__note">
                {midiNoteToName(displayedNoteNumber)}
              </span>
              <kbd className="piano-key__computer-key">
                {pianoKey.keyboardLabel}
              </kbd>
            </div>
          )
        })}
      </div>

      {blackKeys.map((pianoKey) => {
        const displayedNoteNumber = pianoKey.noteNumber + noteOffset
        const isPressed = pressedNotes.includes(displayedNoteNumber)

        return (
          <div
            className={`piano-key piano-key--black${isPressed ? ' piano-key--pressed' : ''}`}
            key={displayedNoteNumber}
            // The outer braces enter JavaScript; the inner braces create a
            // style object. This puts each black key between its white keys.
            style={{ left: `${pianoKey.leftPosition}%` }}
          >
            <span className="piano-key__note">
              {midiNoteToName(displayedNoteNumber)}
            </span>
            <kbd className="piano-key__computer-key">
              {pianoKey.keyboardLabel}
            </kbd>
          </div>
        )
      })}
    </div>
  )
}