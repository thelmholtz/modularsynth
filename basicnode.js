import { NODE_DEFAULTS } from './defaults.js'
import { BasicOsc } from './basicoscillator.js'
import { BasicAmp } from './basicamp.js'


export class BasicNode{
    constructor(audioInstance, outputs, options=NODE_DEFAULTS){
        this.options = options
        this.outputs = outputs
        this.audioInstance = audioInstance

        this.amp = new BasicAmp(audioInstance, this.outputs, options)
        this.osc = new BasicOsc(audioInstance, [this.amp.input], options)

        this.input = this.osc.input
    }

    play(freq){
        if(freq !== undefined)
            this.osc.osc.frequency.value = freq
        this.osc.play()
    }

    stop(){
        this.amp.stop()
        this.osc.stop()
    }

    kill(){
        this.amp.kill()
        this.osc.kill()
    }
}
