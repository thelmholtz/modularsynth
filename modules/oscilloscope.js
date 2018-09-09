import { NODE_DEFAULTS } from '../defaults.js'

export class Oscilloscope{
    constructor(canvas, audioInstance, outputs, options = NODE_DEFAULTS){
        this.audioInstance = audioInstance
        this.canvas = canvas
        this.videoInstance = canvas.getContext('2d')
        this.options = options
        this.outputs = outputs

        this.analyser = audioInstance.createAnalyser()
        this.analyser.fftSize = options.analyser.fftSize

        this.dataArray = new Uint8Array(this.analyser.fftSize)

        this.outputs.forEach((o) => this.analyser.connect(o))
        this.input = this.analyser

        console.log("Oscilloscope built succesfully")
    }

    draw(){
        const width = this.canvas.width = window.innerWidth
        const height = this.canvas.height = window.innerHeight

        let nextFrame = requestAnimationFrame(this.draw.bind(this))

        this.analyser.getByteTimeDomainData(this.dataArray)

        this.videoInstance.fillStyle = this.options.analyser.background
        this.videoInstance.fillRect(0, 0, width, height)

        this.videoInstance.lineWidth = this.options.analyser.waveWidth
        this.videoInstance.strokeStyle = this.options.analyser.wave

        this.videoInstance.beginPath()

        let sliceSize = width * 1.0 / this.analyser.fftSize
        let x = 0

        for (let i = 0; i < this.analyser.fftSize; i++){
            let y =(1 + this.dataArray[i] / 128.0) * height / 4
            if (i === 0)
                this.videoInstance.moveTo(x,y)
            else
                this.videoInstance.lineTo(x, y)
            x += sliceSize
        }
        this.videoInstance.lineTo(width, height / 4)
        this.videoInstance.stroke()

    }
}

