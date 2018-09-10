import { AudioNode } from './modules/audioNode.js'
import { Amp } from './modules/basic/amp.js'
import {
  NOTES,
  A_TUNING,
  getNoteFrequency,
  MAX_FREQ,
  MIN_FREQ
} from './utils.js'
import { NODE_DEFAULTS } from './defaults.js'

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
    let notePressed = NOTES.filter(n => n.key === e.which)[0]

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
          osc: new AudioNode(
            this.audioInstance,
            [this.master.input],
            nodeOptions
          )
        }
        note.osc.play()

        this.noteBuffer.push(note)
      }
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

    if (noteReleased) {
      let liveNote = this.noteBuffer.filter(n => n.key === noteReleased.key)[0]
      if (liveNote) {
        liveNote.osc.kill()
        this.noteBuffer = this.noteBuffer.filter(n => n !== liveNote)
      }
    }
  }
}
