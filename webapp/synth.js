import { Voice } from './modules/voice.js'
import { Amp } from './modules/basic/amp.js'
import {
  NOTES,
  A_TUNING,
  MAX_FREQ,
  MIN_FREQ,
  getNoteFrequency
} from './utils.js'
import { NODE_DEFAULTS } from './defaults.js'

/**
 * Basic substractive synthesizer node.
 *
 * Captures keyboard events and triggers `Voice`s from them.
 *
 * @param audioInstance an AudioContext instance
 * @param outputs an array of WebAudioAPI `AudioNode`s to connect as output
 * @param options optional attributes
 *
 * @note keyboard layout is currently fixed. String 'zsxdcvgbhnjm,' maps to
 *       a C to C piano octave. '1-8' switches the current octave. '9' closes
 *       and '0' opens the filter. '-' lowers the filter envelope amount and
 *       '+' increases it.
 *
 * @dev event listeners should be detached from the global document
 */
export class Synth {
  constructor(audioInstance, outputs, options = NODE_DEFAULTS) {
    this.audioInstance = audioInstance
    this.noteBuffer = []
    this.options = options

    this.master = new Amp(audioInstance, outputs)
    this.master.input.gain.value = 3.0

    document.addEventListener('keydown', e => {
      this.onKeyDown(e)
    })
    document.addEventListener('keyup', e => {
      this.onKeyUp(e)
    })
  }

  onKeyDown(e) {
    //Checks whether the event is mapped to a NOTE in `NOTES`
    let notePressed = NOTES.filter(n => n.key === e.which)[0]
    //If it was pressed, and is not already in the live note buffer,
    //it triggers it.
    if (notePressed) {
      let alreadyPlaying = this.noteBuffer.filter(
        n => n.key === notePressed.key
      )[0]
        ? true
        : false
      if (!alreadyPlaying) {
        let freq = getNoteFrequency(notePressed, A_TUNING, this.options.octave)

        let nodeOptions = NODE_DEFAULTS
        nodeOptions.frequency = freq

        let note = {
          key: notePressed.key,
          osc: new Voice(
            this.audioInstance,
            [this.master.input],
            nodeOptions
          )
        }
        note.osc.play()

        this.noteBuffer.push(note)
      }

    //Otherwise some control events might have happend
    } else if (e.which >= 49 && e.which <= 56) {
      //Keys 1 through 8 control the octave
      this.options.octave = e.which - 49
    } else if (e.which == 48) {
      //Key 9 closes the filter
      if (this.options.filter.cutoff < MAX_FREQ) this.options.filter.cutoff *= 2
    } else if (e.which === 57) {
      //Key 10 opens the filter
      if (this.options.filter.cutoff > MIN_FREQ) this.options.filter.cutoff *= 0.5
    } else if (e.which === 189){
        this.options.filter.envelope.amount -= 0.1
    } else if (e.which === 187){
        this.options.filter.envelope.amount += 0.1
    }
  }

  onKeyUp(e) {
    let noteReleased = NOTES.filter(n => n.key === e.which)[0]
    //If a note was released, and was playing, it kills it and removes it from the buffer
    if (noteReleased) {
      let liveNote = this.noteBuffer.filter(n => n.key === noteReleased.key)[0]
      if (liveNote) {
        liveNote.osc.kill()
        this.noteBuffer = this.noteBuffer.filter(n => n !== liveNote)
      }
    }
  }
}
