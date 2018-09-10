import { NODE_DEFAULTS } from '../defaults.js'
import { Osc } from './basic/osc.js'
import { Amp } from './basic/amp.js'
import { Filter } from './basic/filter.js'
/**
 * A mono voice for a substractive synth. Each voice triggers it's own
 * sub oscillator and filter.
 *
 * @param `audioInstance` an AudioContext instance
 * @param outputs an array of `AudioNode`s to use connect this node output
 * @param options optional voice settings
 */
export class Voice {
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

  /**
   * Plays voice immediatly
   * @params `freq` optional oscillator frequency
   */
  play(freq) {
    if (freq) this.osc.osc.frequency.value = freq
    this.osc.play()
    this.sub.play()
    this.filter.play()
  }

  /**
   * Stops voice but keeps connections
   */
  stop() {
    this.amp.stop()
    this.osc.stop()
    this.filter.stop()
  }

  /**
   * Stops voice and kills connections
   */
  kill() {
    this.amp.kill()
    this.osc.kill()
    this.filter.kill()
  }
}
