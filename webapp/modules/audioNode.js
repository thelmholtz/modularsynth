import { NODE_DEFAULTS } from '../defaults.js'
import { Osc } from './basic/osc.js'
import { Amp } from './basic/amp.js'
import { Filter } from './basic/filter.js'

export class AudioNode {
  constructor(audioInstance, outputs, options = NODE_DEFAULTS) {
    this.options = options
    this.outputs = outputs
    this.audioInstance = audioInstance

    this.filter = new Filter(audioInstance, this.outputs, options)
    this.amp = new Amp(audioInstance, [this.filter.input], options)
    this.osc = new Osc(audioInstance, [this.amp.input], options)
    this.sub = new Osc(audioInstance, [this.amp.input])
    this.sub.input.waveform = 'sine'
    this.sub.input.frequency.value *= 0.5

    this.input = this.osc.input
  }

  play(freq) {
    if (freq) this.osc.osc.frequency.value = freq
    this.osc.play()
    this.sub.play()
    this.filter.play()
  }

  stop() {
    this.amp.stop()
    this.osc.stop()
    this.filter.stop()
  }

  kill() {
    this.amp.kill()
    this.osc.kill()
    this.filter.kill()
  }
}
