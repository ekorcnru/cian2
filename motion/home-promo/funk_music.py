"""Original, short instrumental funk bed for the home-promo video."""
from pathlib import Path
import math
import numpy as np
from scipy.io import wavfile

SR, DUR = 48_000, 15.0
N = int(SR * DUR)
rng = np.random.default_rng(112)
mix = np.zeros((2, N), dtype=np.float64)

def midi(n): return 440 * 2 ** ((n - 69) / 12)
def add(t, signal, pan=0.0, gain=1.0):
    start = int(t * SR); end = min(N, start + len(signal))
    if start < 0 or start >= N or end <= start: return
    left, right = math.sqrt((1 - pan) / 2), math.sqrt((1 + pan) / 2)
    mix[0, start:end] += signal[:end - start] * gain * left
    mix[1, start:end] += signal[:end - start] * gain * right
def envelope(length, attack, decay):
    t = np.arange(length) / SR
    return np.minimum(t / attack, 1) * np.exp(-t / decay)
def bass(note, dur=.31):
    t = np.arange(int((dur + .12) * SR)) / SR; f = midi(note)
    wave = np.sin(2*np.pi*f*t) + .38*np.sin(4*np.pi*f*t) + .12*np.sin(6*np.pi*f*t)
    return wave * envelope(len(t), .006, dur * .52)
def clav(notes):
    t = np.arange(int(.34 * SR)) / SR; signal = np.zeros_like(t)
    for note in notes:
        f = midi(note); signal += np.sin(2*np.pi*f*t) + .32*np.sin(4*np.pi*f*t) + .14*np.sin(6*np.pi*f*t)
    return signal / len(notes) * envelope(len(t), .003, .085)
def kick():
    t = np.arange(int(.38 * SR)) / SR; f = 50 + 95*np.exp(-t/.03)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * envelope(len(t), .002, .14)
def snare():
    t = np.arange(int(.23 * SR)) / SR
    return (rng.standard_normal(len(t)) * .85 + np.sin(2*np.pi*180*t)*.18) * envelope(len(t), .002, .065)
def hat(open_hat=False):
    t = np.arange(int((.19 if open_hat else .06) * SR)) / SR
    return rng.standard_normal(len(t)) * envelope(len(t), .001, .07 if open_hat else .018) * .26

# 112 BPM, tight two-bar vamp: Fm7 → Eb9 → Dbmaj7 → C7.
beat = 60 / 112
roots = [29, 27, 25, 24]
chords = [[53, 56, 60, 63], [51, 55, 58, 63], [49, 53, 56, 60], [48, 52, 55, 58]]
for bar in range(7):
    base = bar * beat * 4; chord = chords[bar % 4]; root = roots[bar % 4]
    for b in range(4):
        at = base + b * beat
        add(at, kick(), gain=.78)
        if b in (1, 3): add(at, snare(), pan=.03, gain=.42)
        for frac, level in ((.0, .56), (.5, .34), (.75, .22)):
            add(at + frac*beat, hat(frac == .75 and b == 3), pan=(-.35 if b % 2 else .35), gain=level)
    for offset, step, accent in ((0,0,1), (.75,0,0), (1.5,7,0), (2.0,0,1), (2.75,10,0), (3.25,7,0), (3.75,0,1)):
        add(base + offset*beat, bass(root + step), pan=-.08, gain=.49 + .10*accent)
    for offset, notes, pan in ((.75, chord, -.18), (1.75, chord, .18), (2.5, chord, -.12), (3.5, chord, .22)):
        add(base + offset*beat, clav(notes), pan=pan, gain=.31)

# Punchy fills land exactly on the three interface openings; a final stab supports success.
for impact, notes in ((2.60, [65, 68, 72]), (5.80, [63, 67, 70]), (9.40, [61, 65, 68]), (12.60, [65, 68, 72, 77])):
    add(impact, kick(), gain=.98)
    add(impact, clav(notes), pan=.05, gain=.47)
    add(impact + .09, clav([note + 12 for note in notes[:3]]), pan=-.12, gain=.24)

fade = int(1.2 * SR); mix[:, -fade:] *= np.linspace(1, 0, fade)**1.5
mix = np.tanh(mix * 1.45)
mix *= 10 ** (-9 / 20) / max(np.abs(mix).max(), 1e-9)
out = Path('build/funk.wav'); out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, (mix.T * 32767).astype(np.int16))
print(f'[funk] {out}: {DUR:.1f} s, 112 BPM, original instrumental')
