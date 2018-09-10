import { NOTES, A_TUNING, getNoteFrequency } from './utils.js'
import { Synth } from './synth.js'
import { Oscilloscope } from './modules/oscilloscope.js'

let audioContext = window.AudioContext || window.webkitAudioContext
let audioInstance = new audioContext()

let canvas = document.getElementById('synth_container')

let oscilloscope = new Oscilloscope(canvas, audioInstance, [
  audioInstance.destination
])

requestAnimationFrame(oscilloscope.draw.bind(oscilloscope))
let synth = new Synth(audioInstance, [oscilloscope.input])
