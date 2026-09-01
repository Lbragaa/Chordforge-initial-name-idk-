import { useEffect, useState } from 'react' // react things. useState lets the component remember information. useEffect - lets it connect to something outside react
import { PianoKeyboard } from './components/PianoKeyboard'
import { getNoteForKeyboardCode } from './input/keyboardNoteMap' // pegando o bagulho la do notemap
import { midiNoteToName } from './music/noteNames'
import './App.css'


function App() {
  const [pressedNotes, setPressedNotes] = useState<number[]>([]) // now the initial value is an empty the list, and the expect one is a number list
  const [keyboardOctave, setKeyboardOctave] = useState(4)
  const octaveNoteOffset = (keyboardOctave - 4) * 12

  useEffect(() => {

    // Function preparing for the blur. Like alt-tab. This prevents from notes getting stuck and shi
    function handleWindowBlur() {
      setPressedNotes([])
    }

    function handleKeyDown(event: KeyboardEvent) {
      const baseNoteNumber = getNoteForKeyboardCode(event.code)

      if (baseNoteNumber === undefined) {
        return
      }

      // The original map describes C4-C5. Every octave is 12 MIDI notes,
      // so this offset moves the whole computer-keyboard range together.
      const noteNumber = baseNoteNumber + octaveNoteOffset

      setPressedNotes((previousNotes) => {
        if (previousNotes.includes(noteNumber)) {
          return previousNotes
        }

        return [...previousNotes, noteNumber] // Junta uma lista agrupada dos dois.
      })
    }

    function handleKeyUp(event: KeyboardEvent) {
      const baseNoteNumber = getNoteForKeyboardCode(event.code)

      if (baseNoteNumber === undefined) {
        return
      }

      const noteNumber = baseNoteNumber + octaveNoteOffset

      setPressedNotes((previousNotes) => {
        return previousNotes.filter((note) => note !== noteNumber)  // so passa se vc passar o filtro. pra cada levantada tem um desse ai
      })
    }

    // os chamadores de funcao tao aq
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [octaveNoteOffset]) // Reconnect the listeners when they need to use a new octave.


  // Funcao pro butao de Octave Change ai, que vai no limite de 4 aparentemente, ou nao tem sla
  function handleOctaveChange(change: number) {
    // Clear held notes before changing range so an old note cannot get stuck.
    setPressedNotes([])
    setKeyboardOctave((previousOctave) => previousOctave + change)
  }

  // i had put this inside useEffect. Thats dumb.
  const pressedNoteNames = pressedNotes.map((noteNumber) => { // map agora tacou a funcao em geral. legal
    return midiNoteToName(noteNumber)
  })

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Musicianship trainer</p>
        <h1>Chordforge</h1>
        <p className="introduction">
          Learn to recognize and play musical ideas using the keyboard you have
          available.
        </p>
      </header>

      <section className="input-section" aria-labelledby="input-heading">
        <div>
          <p className="section-label">Input sources</p>
          <h2 id="input-heading">How you will play</h2>
        </div>

        <div className="input-grid">
          <article className="input-card">
            <p className="input-status">Test with your keyboard</p>
            <h3>Computer keyboard</h3>

            <p className="note-readout">
              Pressed notes:{' '}
              <strong>
                {pressedNoteNames.length === 0
                  ? 'None'
                  : pressedNoteNames.join(', ')}
              </strong>
            </p>

            <p className="note-readout">
              MIDI numbers:{' '}
              <strong>
                {pressedNotes.length === 0 ? 'None' : pressedNotes.join(', ')}
              </strong>
            </p>

            <div className="octave-controls" aria-label="Computer keyboard octave">
              <button
                type="button"
                onClick={() => handleOctaveChange(-1)}
                disabled={keyboardOctave === 1}
              >
                Octave down
              </button>
              <p aria-live="polite">
                Range: C{keyboardOctave}–C{keyboardOctave + 1}
              </p>
              <button
                type="button"
                /*Eh so um butao com o onClick */
                onClick={() => handleOctaveChange(1)}
                disabled={keyboardOctave === 7}
              >
                Octave up
              </button>
            </div>

            {/*GPT description: Give PianoKeyboard a prop named pressedNotes / it also gives noteOffset now, using the value stored in App’s pressedNotes variable. */}
            <PianoKeyboard
              pressedNotes={pressedNotes}
              noteOffset={octaveNoteOffset}
            />

            <p>
              Use letter keys as piano keys without a MIDI controller.
            </p>
          </article>

          <article className="input-card">
            <p className="input-status">Added in a later milestone</p>
            <h3>MIDI keyboard</h3>
            <p>
              Connect a MIDI controller for a wider note range and velocity
              information.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
