import { MAX_FREQ } from '../../utils.js'
import { NODE_DEFAULTS } from '../../defaults.js'

/**
 * Low pass filter with adsr envelope in the cutoff
 *
 * @param `audioInstance` an AudioContext instance
 * @param `outputs` an array of AudioNode s to use as output
 * @param `options` optional settings for this module
 */
export class Filter {
  constructor(audioInstance, outputs, options = NODE_DEFAULTS) {
    this.audioInstance = audioInstance
    this.outputs = outputs
    this.options = options

    this.filter = audioInstance.createBiquadFilter()
    this.filter.type = options.filter.type
    this.filter.frequency.value = options.filter.cutoff

    this.outputs.forEach(o => this.filter.connect(o))
    this.input = this.filter
  }

  /**
   * Triggers attack decay sustain fase
   */
  play() {
    this.filter.frequency.linearRampToValueAtTime(
      this.options.filter.cutoff +
        this.options.filter.envelope.amount *
          (MAX_FREQ - this.options.filter.cutoff),
      this.audioInstance.currentTime + this.options.filter.envelope.attack
    )

    this.filter.frequency.linearRampToValueAtTime(
      this.options.filter.cutoff +
        this.options.filter.envelope.amount *
          (MAX_FREQ - this.options.filter.cutoff) *
          this.options.filter.envelope.sustain,
      this.audioInstance.currentTime + this.options.filter.envelope.decay
    )
  }

  /**
   * Triggers release phase and disconnects when finished
   */
  kill() {
    this.filter.frequency.linearRampToValueAtTime(
      this.options.filter.cutoff,
      this.audioInstance.currentTime + this.options.filter.envelope.release
    )
    setTimeout(() => {
        this.outputs.forEach(
          (o) => this.filter.disconnect(o)
        )}, this.options.filter.envelope.release * 1000)
  }

  /**
   * Triggers release phase
   */
  stop() {
    this.filter.frequency.linearRampToValueAtTime(
      this.options.filter.cutoff,
      this.audioInstance.currentTime + this.options.filter.envelope.release
    )
  }
}
