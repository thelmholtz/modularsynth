import { BasicNode } from './basicnode.js'
import { NOTES, A_TUNING, getNoteFrequency } from './utils.js'
import { Synth } from './synth1.js'
import { Oscilloscope } from './oscilloscope.js'

let audioContext = window.AudioContext || window.webkitAudioContext
let audioInstance = new audioContext();
//console.log("Initializing node")
//let onlyNode = new BasicNode(audioInstance, [audioInstance.destination]);
//onlyNode.play()
//onlyNode.kill()
//
let canvas = document.getElementById('synth_container')

let oscilloscope = new Oscilloscope(canvas, audioInstance, [audioInstance.destination])
requestAnimationFrame(oscilloscope.draw.bind(oscilloscope))
let synth = new Synth(audioInstance, [oscilloscope.input])


