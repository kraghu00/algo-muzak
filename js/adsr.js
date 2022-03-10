
const ctx = new (window.AudioContext || window.webkitAudioContext)()

const tone = new OscillatorNode(ctx)
const lvl = new GainNode(ctx, { gain: 0.001 })
const fft = new AnalyserNode(ctx)

tone.connect(lvl)
lvl.connect(ctx.destination)
lvl.connect(fft)

function adsr (param, peak, val, time, a, d, s, r) {
  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(val, time+a+d)
  param.linearRampToValueAtTime(val, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}

// schedule when to play notes && how to apply the ADSR envelope to each

const p = 0.5 // peak value for all tones
const v = 0.2 // sustained value for all tones

tone.frequency.setValueAtTime(440.00, ctx.currentTime)
adsr(lvl.gain, p,v, ctx.currentTime, 0.1,0.1,0.1,0.2) // 0.5s

tone.frequency.setValueAtTime(523.25, ctx.currentTime + 0.5)
adsr(lvl.gain, p,v, ctx.currentTime + 0.5, 0.1,0.1,0.1,0.2) // 0.5s

tone.frequency.setValueAtTime(659.26, ctx.currentTime + 1.0)
adsr(lvl.gain, p,v, ctx.currentTime + 1, 0.1,0.1,0.1,0.2) // 0.5s

tone.frequency.setValueAtTime(880, ctx.currentTime + 1.5)
adsr(lvl.gain, p,v, ctx.currentTime + 1.5, 0.1,0.1,0.1,0.2) // 0.5s

tone.frequency.setValueAtTime(659.26, ctx.currentTime + 2)
adsr(lvl.gain, p,v, ctx.currentTime + 2, 0.1,0.1,0.1,0.2) // 0.5s

tone.frequency.setValueAtTime(523.25, ctx.currentTime + 2.5)
adsr(lvl.gain, p,v, ctx.currentTime + 2.5, 0.1,0.1,0.1,0.2) // 0.5s

tone.start(ctx.currentTime)
tone.stop(ctx.currentTime + 3)


createWaveCanvas({ element: 'section', analyser: fft })
