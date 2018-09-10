import { NODE_DEFAULTS } from '../../defaults.js'

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

  play() {
    this.osc.start(0)
  }

  stop() {
    this.osc.stop(
      this.audioInstance.currentTime + this.options.envelope.release
    )
  }

  kill() {
    setTimeout(() => {
      this.osc.stop(0)
      this.outputs.forEach(o => this.osc.disconnect(o))
    }, this.options.envelope.release * 1000)
  }
}
