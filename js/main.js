const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048 })
createWaveCanvas({ element: 'section', analyser: fft })

function tone(type, pitch, time, duration) {
  const t = time || ctx.currentTime
  const dur = duration || 1
  const osc = new OscillatorNode(ctx, {
    type: type || 'sine',
    frequency: pitch || 440
  })
  const lvl = new GainNode(ctx, { gain: 0 })
  osc.connect(lvl)
  lvl.connect(ctx.destination)
  lvl.connect(fft)
  osc.start(t)
  osc.stop(t + 4)
  adsr({ param: lvl.gain, duration: dur})
}
function adsr (opts) {
  const param = opts.param
  const peak = opts.peak || 0.5
  const hold = opts.peak || 0.4
  const time = opts.time || ctx.currentTime
  const dur = opts.duration || 1
  const a = opts.attack || 0.2 * dur
  const d = opts.decay || 0.1 * dur
  const s = opts.sustain || 0.5 * dur
  const r = opts.release || 0.2 * dur

  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(hold, time+a+d)
  param.linearRampToValueAtTime(hold, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}
function step (rootFreq, steps) {
  let tr2 = Math.pow(2, 1/12)
  let rnd = rootFreq * Math.pow(tr2, steps)
  return Math.round(rnd * 100) /100
}

const major = [0, 2, 4, 5, 7, 9, 11, 12]
const minor = [0, 2, 3, 5, 7, 8, 10, 12]

tone('sine')


// for (let i = 0; i < 16; i++) {
//   let time = ctx.currentTime + (i / 4)
//   let n = Math.floor(Math.random()*major.length)
//   const pitch = step(440, n)
//   tone('sine', pitch, time, 0.25)
// }
