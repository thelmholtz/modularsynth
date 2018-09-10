import { NODE_DEFAULTS } from '../defaults.js'

/**
 * Experimental oscilloscope made with an analyser drawing a canvas
 *
 * @param `canvas` a canvas DOM element
 * @param `audioInstance` an AudioContext instance
 * @param `outputs` an array of `AudioNode`s to connect the output of this node
 * @param `options` optional configuration
 */
export class Oscilloscope {
  constructor(canvas, audioInstance, outputs, options = NODE_DEFAULTS) {
    this.audioInstance = audioInstance
    this.canvas = canvas
    this.videoInstance = canvas.getContext('2d')
    this.options = options
    this.outputs = outputs

    this.analyser = audioInstance.createAnalyser()
    this.analyser.fftSize = options.analyser.fftSize

    this.dataArray = new Uint8Array(this.analyser.fftSize)

    this.outputs.forEach(o => this.analyser.connect(o))

    this.input = this.analyser
  }

  /*
   * Draws the input signal
   *
   * @dev should be fixed to make it possible to run as a component
   *      instead of taking over the whole window.
   * @dev unnecesary bind call is too slow and should be removed
   */
  draw() {
    const width = (this.canvas.width = window.innerWidth)
    const height = (this.canvas.height = window.innerHeight)

    //TODO bind should be removed
    requestAnimationFrame(this.draw.bind(this))

    this.analyser.getByteTimeDomainData(this.dataArray)

    this.videoInstance.fillStyle = this.options.analyser.background
    this.videoInstance.fillRect(0, 0, width, height)
    this.videoInstance.lineWidth = this.options.analyser.waveWidth
    this.videoInstance.strokeStyle = this.options.analyser.wave

    let x = 0
    let deltaX = (width * 1.0) / this.analyser.fftSize

    this.videoInstance.beginPath()

    for (let i = 0; i < this.analyser.fftSize; i++) {

      //Not sure how this magic works, but it did center the signal vertically.
      let y = ((1 + this.dataArray[i] / 128.0) * height) / 4

      if (i === 0) this.videoInstance.moveTo(x, y)
      else this.videoInstance.lineTo(x, y)

      x += deltaX
    }

    this.videoInstance.lineTo(width, height / 4)
    this.videoInstance.stroke()
  }
}
