import { useEffect, useState } from 'react' // react things. useState lets the component remember information. useEffect - lets it connect to something outside react
import { getNoteForKeyboardCode } from './input/keyboardNoteMap' // pegando o bagulho la do notemap
import { midiNoteToName } from './music/noteNames'
import './App.css'


function App() {
  const [pressedNotes, setPressedNotes] = useState<number[]>([]) // now the initial value is an empty the list, and the expect one is a number list

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const noteNumber = getNoteForKeyboardCode(event.code)

      if (noteNumber === undefined) {
        return
      }

      setPressedNotes((previousNotes) => {
        if (previousNotes.includes(noteNumber)) {
          return previousNotes
        }

        return [...previousNotes, noteNumber] // Junta uma lista agrupada dos dois.
      })
    }

    function handleKeyUp(event: KeyboardEvent) {
      const noteNumber = getNoteForKeyboardCode(event.code)

      if (noteNumber === undefined) {
        return
      }

      setPressedNotes((previousNotes) => {
        return previousNotes.filter((note) => note !== noteNumber)  // so passa se vc passar o filtro. pra cada levantada tem um desse ai
      })
    }

    // os chamadores de funcao tao aq
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, []) // means React should connect this listener when the component appears, not after every render.

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
