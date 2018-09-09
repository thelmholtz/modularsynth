import { NODE_DEFAULTS } from './defaults.js'

export const UNITY = 1
export const SILENCE = 0

export class BasicAmp{
    constructor(audioInstance, outputs, options=NODE_DEFAULTS){
        this.audioInstance = audioInstance
        this.outputs = outputs
        this.env = options.envelope || NODE_DEFAULTS.envelope
        this.gain = options.gain || NODE_DEFAULTS.gain

        this.amp = audioInstance.createGain()

        this.amp.gain.value = this.gain
        this.amp.gain.linearRampToValueAtTime(UNITY, this.audioInstance.currentTime + this.env.attack)
        this.amp.gain.linearRampToValueAtTime(this.env.sustain * UNITY, this.audioInstance.currentTime + this.env.decay)

        this.outputs.forEach((o)=>this.amp.connect(o))

        this.input = this.amp
    }

    stop() {
        this.amp.gain.linearRampToValueAtTime(SILENCE, this.audioInstance.currentTime + this.env.release)
    }

    kill() {
            this.amp.gain.linearRampToValueAtTime(SILENCE, this.audioInstance.currentTime + this.env.release)
        console.log("Amp timing out while ramping")
        setTimeout(() => {
            this.outputs.forEach((o) => this.amp.disconnect(o))
            console.log("Amp is dead")
            }, this.env.release*1000)
        }

}
