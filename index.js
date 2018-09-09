import { BasicNode } from './basicnode.js'
import { NOTES, A_TUNING, getNoteFrequency } from './utils.js'
import { Synth } from './synth1.js'

let audioContext = window.AudioContext || window.webkitAudioContext
let audioInstance = new audioContext();
//console.log("Initializing node")
//let onlyNode = new BasicNode(audioInstance, [audioInstance.destination]);
//onlyNode.play()
//onlyNode.kill()
let synth = new Synth(audioInstance, [audioInstance.destination])
