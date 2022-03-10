const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048 })


// source nodes
const tone = new OscillatorNode(ctx, { // constructor method
    type: 'sine',
    frequency: 440
})

const tone2 = new OscillatorNode(ctx, { // constructor method
    type: 'sine',
    frequency: 329.63
})

// processor nodes
const lvl = new GainNode(ctx, {
  gain: 0.25 // scale volume down by half
})

// setValueAtTime, linearRampToValueAtTime, exponentialRampToValueAtTime
lvl.gain.linearRampToValueAtTime(0.25, ctx.currentTime)
lvl.gain.linearRampToValueAtTime(1, ctx.currentTime + 1)
lvl.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2)


tone.connect(lvl)
tone2.connect(lvl)

lvl.connect(ctx.destination)
lvl.connect(fft)

tone.start(ctx.currentTime)
tone.stop(ctx.currentTime + 2)

tone2.start(ctx.currentTime)
tone2.stop(ctx.currentTime + 2)


// analyzer nodes
createWaveCanvas({ element: 'section', analyser: fft })




















/*

  const tone = new OscillatorNode(ctx)
  tone.connect(fft)
  tone.connect(ctx.destination)
  tone.start(ctx.currentTime)
  tone.stop(ctx.currentTime + 1)

*/

// const tone = ctx.createOscillator() // factory method
// tone.type = 'sine'
// tone.frequency.value = 440
