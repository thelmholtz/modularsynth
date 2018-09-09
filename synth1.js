import { BasicNode } from './basicnode.js'
import { BasicAmp } from './basicamp.js'
import { NOTES, A_TUNING, getNoteFrequency } from './utils.js'
import { NODE_DEFAULTS } from './defaults.js'

export class Synth{
    constructor(audioInstance, outputs, options = NODE_DEFAULTS){
        this.audioInstance = audioInstance
        this.noteBuffer = []
        this.options = options

        this.master = new BasicAmp(audioInstance, outputs)

        document.addEventListener('keydown', (e) => { this.onKeyDown(e) })
        document.addEventListener('keyup', (e) => { this.onKeyUp(e) })
        }

    onKeyDown(e){
        let notePressed = NOTES.filter((n) => n.key === e.which)[0]

        if (notePressed){

            let alreadyPlaying = this.noteBuffer.filter((n) => n.key === notePressed.key)[0]?true:false
            if(!alreadyPlaying){
                let freq = getNoteFrequency(notePressed, A_TUNING, this.options.octave)

                let nodeOptions = NODE_DEFAULTS
                nodeOptions.frequency = freq

                let note = {key: notePressed.key, osc:new BasicNode(this.audioInstance, [this.master.input], nodeOptions)}
                note.osc.play()

                this.noteBuffer.push(note)
            }
        } else if (e.which >= 49 && e.which <= 55){
            this.options.octave = e.which - 49
        } else if (e.which == 48) {
            this.options.filter.cutoff *= 2
        } else if (e.which === 57) {
            this.options.filter.cutoff *= 0.5
        }
    }

    onKeyUp(e){
        let noteReleased = NOTES.filter((n) => n.key === e.which)[0]

        if(noteReleased){
            let liveNote = this.noteBuffer.filter((n) => n.key === noteReleased.key)[0]
            if (liveNote){
                liveNote.osc.kill()
                this.noteBuffer = this.noteBuffer.filter((n) => n !== liveNote)
            }

        }
    }
}


