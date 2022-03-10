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
  const lvl = new GainNode(ctx, { gain: 0.001 })
  osc.connect(lvl)
  lvl.connect(ctx.destination)
  lvl.connect(fft)
  osc.start(t)
  osc.stop(t + dur)
  adsr({
    param: lvl.gain,
    time: t,
    duration: dur
  })
}
function adsr (opts) {
  const param = opts.param
  const peak = opts.peak || 0.2
  const hold = opts.peak || 0.1
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
function r (scale) {
  return Math.floor(Math.random()*scale.length)
}

const major = [0, 2, 4, 5, 7, 9, 11, 12]
const minor = [0, 2, 3, 5, 7, 8, 10, 12]

// A:0, A#:1, B:2, C:3, C#:4, D:5, D#:6,
// E:7, F:8, F#:9, G:10, G#:11, A:12

const delayStart = 0.5
const tempo = 140 * 2
const beat = 60 / tempo
const bar = beat * 5
const root = 880
const pattern = [0, 5, 7, 12]
const scale = pattern
const notes = [
  0, 5, 7, 12,
  0, 5, 7, 12,
  0, 5, 7, 12,
  0, 5, 7, 12,
  0, 5, 7, 12,
  0, 5, 7, 12
]

for (var b = 0; b < 4; b++) {
  const delayB = b * bar * 4
  for (let a = 0; a < 4; a++) {
    const delayA = a * bar
    notes[5] = r(minor)
    notes[6] = r(minor)
    notes[7] = r(major)
    notes[9] = r(major)
    notes[11] = r(pattern)
    for (var i = 0; i < notes.length; i++) {
      const time = i*beat + delayStart + delayA + delayB
      const dur = beat
      const pitch = step(root, notes[i])
      tone('sawtooth', pitch, time, dur)
    }
  }
}

for (var i = 0; i < notes.length*4 + beat*(Math.random()*5); i++) {
  const time = i*beat + delayStart
  const dur = beat/2
  const pitch = step(root, notes[i])
  tone('triangle', 440, time, dur)
}

for (var i = 0; i < notes.length*7 + beat*(Math.random()*5); i++) {
  const time = i*beat/2 + delayStart + Math.random()/2
  const dur = beat/4
  const pitch = step(root, notes[i])
  tone('square', 440, time, dur)
}

for (var i = 0; i < notes.length; i++) {
  const time = i*beat + delayStart + beat*83
  const dur = beat
  const pitch = step(root, notes[i])
  tone('sawtooth', 440, time, dur)
}

for (var i = 0; i < notes.length*8; i++) {
  const time = i*beat/2 + delayStart
  const dur = beat/4
  const pitch = step(root, notes[i])
  tone('square', 220, time, dur)
}
