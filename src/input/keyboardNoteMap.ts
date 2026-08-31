// export is just making available to other files
export const keyboardNoteMap: Record<string, number> = {
  KeyA: 60, // C4
  KeyW: 61,
  KeyS: 62,
  KeyE: 63,
  KeyD: 64,
  KeyF: 65,
  KeyT: 66,
  KeyG: 67,
  KeyY: 68,
  KeyH: 69,
  KeyU: 70,
  KeyJ: 71,
  KeyK: 72,
}

export function getNoteForKeyboardCode(
  code: string,
): number | undefined { // it returns either a number or an undefined if it is not in our keboardNoteMap
  const noteNumber = keyboardNoteMap[code]

  return noteNumber
}