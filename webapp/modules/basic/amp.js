import { NODE_DEFAULTS } from '../../defaults.js'

export const UNITY = 1
export const SILENCE = 0

/**
 * Basic amp with adsr env wrapper.
 *
 * @param `audioInstance` an AudioContext instance
 * @param `outputs` an array of `AudioNode`s to connect the output of this node
 * @param `options` optional amp settings. View `../../defaults.js` for more info
 */
export class Amp {
  constructor(audioInstance, outputs, options = NODE_DEFAULTS) {
    this.audioInstance = audioInstance
    this.outputs = outputs
    this.options = options

    this.amp = audioInstance.createGain()

    this.amp.gain.value = this.options.gain
    this.amp.gain.linearRampToValueAtTime(
      UNITY,
      this.audioInstance.currentTime + this.options.envelope.attack
    )
    this.amp.gain.linearRampToValueAtTime(
      thisi.options.envelope.sustain * UNITY,
      this.audioInstance.currentTime + this.options.envelope.decay
    )

    this.outputs.forEach(o => this.amp.connect(o))

    this.input = this.amp
  }

  /**
   * Toggles release ramp
   */
  stop() {
    this.amp.gain.linearRampToValueAtTime(
      SILENCE,
      this.audioInstance.currentTime + this.options.envelope.release
    )
  }

  /**
   * Toggles release ramp and kills connections after completion
   */
  kill() {
    this.amp.gain.linearRampToValueAtTime(
      SILENCE,
      this.audioInstance.currentTime + this.options.envelope.release
    )
    setTimeout(() => {
      this.outputs.forEach(o => this.amp.disconnect(o))
    }, this.options.envelope.release * 1000)
  }
}
