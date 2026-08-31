import { midiNoteToName } from '../music/noteNames'
import './PianoKeyboard.css'

type PianoKeyboardProps = {
  pressedNotes: number[]
}

type WhitePianoKey = {
  noteNumber: number
  keyboardLabel: string
}

type BlackPianoKey = WhitePianoKey & {
  leftPosition: number
}

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

const blackKeys: BlackPianoKey[] = [
  { noteNumber: 61, keyboardLabel: 'W', leftPosition: 12.5 },
  { noteNumber: 63, keyboardLabel: 'E', leftPosition: 25 },
  { noteNumber: 66, keyboardLabel: 'T', leftPosition: 50 },
  { noteNumber: 68, keyboardLabel: 'Y', leftPosition: 62.5 },
  { noteNumber: 70, keyboardLabel: 'U', leftPosition: 75 },
]

export function PianoKeyboard({ pressedNotes }: PianoKeyboardProps) {
  return (
    <div className="piano-keyboard" aria-hidden="true">
      <div className="piano-keyboard__white-keys">
        {whiteKeys.map((pianoKey) => {
          const isPressed = pressedNotes.includes(pianoKey.noteNumber)

          return (
            <div
              className={`piano-key piano-key--white${isPressed ? ' piano-key--pressed' : ''}`}
              key={pianoKey.noteNumber}
            >
              <span className="piano-key__note">
                {midiNoteToName(pianoKey.noteNumber)}
              </span>
              <kbd className="piano-key__computer-key">
                {pianoKey.keyboardLabel}
              </kbd>
            </div>
          )
        })}
      </div>

      {blackKeys.map((pianoKey) => {
        const isPressed = pressedNotes.includes(pianoKey.noteNumber)

        return (
          <div
            className={`piano-key piano-key--black${isPressed ? ' piano-key--pressed' : ''}`}
            key={pianoKey.noteNumber}
            style={{ left: `${pianoKey.leftPosition}%` }}
          >
            <span className="piano-key__note">
              {midiNoteToName(pianoKey.noteNumber)}
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
