import { useEffect, useState } from 'react' // react things. useState lets the component remember information. useEffect - lets it connect to something outside react
import { getNoteForKeyboardCode } from './input/keyboardNoteMap' // pegando o bagulho la do notemap
import './App.css'

function App() {
  const [lastNote, setLastNote] = useState<number | null>(null) // number | null is the allowed values to them. the (null) is its initial value

  useEffect(() => { // usando o tal do useEffect do React
    function handleKeyDown(event: KeyboardEvent) {
      const noteNumber = getNoteForKeyboardCode(event.code)

      if (noteNumber !== undefined) { // se existir nota
        setLastNote(noteNumber)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => { // it removes the listener if the component leaves the page
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, []) // means React should connect this listener when the component appears, not after every render.

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
            <p className="input-status">Available during development</p>
            <h3>Computer keyboard</h3>
            <p className="note-readout">
              {/* This is like a variable apparently, getting the lastNote and changing it*/}
              Last note: <strong>{lastNote ?? 'None yet'}</strong>
            </p>

            <p>
              Use letter keys as piano keys while developing and practising
              without a MIDI controller.
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
