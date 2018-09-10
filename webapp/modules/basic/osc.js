import { NODE_DEFAULTS } from '../../defaults.js'

/**
 * Basic oscillator
 *
 * @param `audioInstance` an AudioContext instance
 * @param `outputs` an array of AudioNode s to use as output
 * @param `options` optional module settings (including frequency)
 */
export class Osc {
  constructor(audioInstance, outputs, options = NODE_DEFAULTS) {
    this.audioInstance = audioInstance
    this.options = options
    this.outputs = outputs

    this.osc = audioInstance.createOscillator()
    this.osc.type = this.options.waveform
    this.osc.frequency.value = this.options.frequency

    this.outputs.forEach(o => this.osc.connect(o))

    this.input = this.osc
  }

  /**
   * Plays the oscillator
   */
  play() {
    this.osc.start(0)
  }

  /**
   * Stops the oscillator after the release is finnished
   */
  stop() {
    this.osc.stop(
      this.audioInstance.currentTime + this.options.envelope.release
    )
  }

  /**
   * Stops the oscillator and then disconnects
   */
  kill() {
    setTimeout(() => {
      this.osc.stop(0)
      this.outputs.forEach(o => this.osc.disconnect(o))
    }, this.options.envelope.release * 1000)
  }
}
