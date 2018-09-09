export const NOTES = [
    {name: 'C', key: 90, offset: -9},
    {name: 'Dd', key: 83, offset: -8},
    {name: 'D', key: 88, offset: -7},
    {name: 'Eb', key: 68, offset: -6},
    {name: 'E', key: 67, offset: -5},
    {name: 'F', key: 86, offset: -4},
    {name: 'Gb', key: 71, offset: -3},
    {name: 'G', key: 66, offset: -2},
    {name: 'Ab', key: 72, offset: -1},
    {name: 'A', key: 78, offset: 0},
    {name: 'Bb', key: 74, offset: 1},
    {name: 'B', key: 77, offset: 2},
    {name: 'C8', key: 188, offset: 3}
]

export const A_TUNING = 440

export const MIN_FREQ = 20

export const MAX_FREQ = 20000

export function getNoteFrequency(note, tuning, octave=4){
    octave = octave-4       //Translates between musician standard octaves and octave's as a frequency shift from central A
    return Math.pow(Math.pow(2, 1/12), note.offset) * Math.pow(2, octave) * A_TUNING
}

