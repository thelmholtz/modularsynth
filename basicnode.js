import { NODE_DEFAULTS } from './defaults.js'
import { BasicOsc } from './basicoscillator.js'
import { BasicAmp } from './basicamp.js'
import { Filter } from './filter.js'


export class BasicNode{
    constructor(audioInstance, outputs, options=NODE_DEFAULTS){
        this.options = options
        this.outputs = outputs
        this.audioInstance = audioInstance

        this.filter = new Filter(audioInstance, this.outputs, options)
        this.amp = new BasicAmp(audioInstance, [this.filter.input], options)
        this.osc = new BasicOsc(audioInstance, [this.amp.input], options)

        this.input = this.osc.input
    }

    play(freq){
        if(freq !== undefined)
            this.osc.osc.frequency.value = freq
        this.osc.play()
        this.filter.play()
    }

    stop(){
        this.amp.stop()
        this.osc.stop()
        this.filter.stop()
    }

    kill(){
        this.amp.kill()
        this.osc.kill()
        this.filter.kill()
    }
}
