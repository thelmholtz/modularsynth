import { BasicNode } from './basicnode.js'
import { BasicAmp } from './basicamp.js'
import { NOTES, A_TUNING, getNoteFrequency } from './utils.js'
import { NODE_DEFAULTS } from './defaults.js'

export class Synth{
    constructor(audioInstance, outputs){
        this.audioInstance = audioInstance
        this.noteBuffer = []
        this.master = new BasicAmp(audioInstance, outputs)

        document.addEventListener('keydown', (e) => { this.onKeyDown(e) })
        document.addEventListener('keyup', (e) => { this.onKeyUp(e) })
        }

    onKeyDown(e){
        let notePressed = NOTES.filter((n) => n.key === e.which)[0]

        if (notePressed){

            let alreadyPlaying = this.noteBuffer.filter((n) => n.key === notePressed.key)[0]?true:false
            if(!alreadyPlaying){
                let freq = getNoteFrequency(notePressed, A_TUNING)

                let nodeOptions = NODE_DEFAULTS
                nodeOptions.frequency = freq

                let note = {key: notePressed.key, osc:new BasicNode(this.audioInstance, [this.master.input], nodeOptions)}
                note.osc.play()

                this.noteBuffer.push(note)
            }
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


