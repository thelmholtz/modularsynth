import { MAX_FREQ } from '../../utils.js'
import { NODE_DEFAULTS } from '../../defaults.js'

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

  kill() {
    this.filter.frequency.linearRampToValueAtTime(
      this.options.filter.cutoff,
      this.audioInstance.currentTime + this.options.filter.envelope.release
    )
  }

  stop() {
    this.filter.frequency.linearRampToValueAtTime(
      this.options.filter.cutoff,
      this.audioInstance.currentTime + this.options.filter.envelope.release
    )
  }
}
