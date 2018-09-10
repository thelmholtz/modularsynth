// Most defaults are overriden by user input.

export const NODE_DEFAULTS = {
  gain: 1,
  envelope: {
    attack: 22 / 1000,
    decay: 200 / 1000,
    sustain: 0.3,
    release: 500 / 1000
  },
  frequency: 220,
  waveform: 'sawtooth',
  filter: {
    type: 'lowpass',
    cutoff: 40,
    resonance: 0.3,
    envelope: {
      amount: 0.005,
      attack: 33 / 1000,
      decay: 100 / 1000,
      sustain: 0.09,
      release: 100 / 1000
    }
  },
  analyser: {
    fftSize: 512,
    background: 'rgb(0,0,12)',
    wave: 'rgb(15,170,60)',
    waveWidth: 4
  },
  octave: 4
}
