"""Original, royalty-free beat for the NoraOffer reel (no samples, pure synthesis).

128 BPM electro / mahraganat-flavoured groove in D Hijaz, with hits placed on the
reel's beats: hook at 0s, riser into the offer at 16s, price reveal at 21.5s, CTA at 26s.
Usage: python3 scripts/beat.py out.wav
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 128
BEAT = 60 / BPM
LENGTH = 29.5
N = int(SR * LENGTH)
rng = np.random.default_rng(7)

mix = np.zeros((N, 2))


def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    left, right = gain * (1 - max(pan, 0)), gain * (1 + min(pan, 0))
    mix[i : i + len(sig), 0] += sig * left
    mix[i : i + len(sig), 1] += sig * right


def env(n, attack=0.005, decay=0.2):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t / decay)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    freq = 45 + 110 * np.exp(-t * 28)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * env(n, 0.001, 0.16) * 1.1


def clap():
    n = int(0.25 * SR)
    noise = rng.uniform(-1, 1, n)
    # three quick bursts then a tail, band-limited by differencing
    e = np.zeros(n)
    for k, off in enumerate([0, 0.011, 0.022]):
        s = int(off * SR)
        e[s:] += np.exp(-np.arange(n - s) / SR / (0.008 if k < 2 else 0.09))
    bright = np.diff(noise, prepend=0)
    return bright * e * 0.45


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    noise = rng.uniform(-1, 1, n)
    hp = np.diff(np.diff(noise, prepend=0), prepend=0)
    return hp * env(n, 0.001, 0.06 if open_ else 0.015) * 0.12


def saw(freq, dur, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, 12):
        out += np.sin(2 * np.pi * freq * h * t) / h * (bright ** (h - 1))
    return out


def bass(freq, dur):
    n = int(dur * SR)
    return (saw(freq, dur, 0.55) * 0.5 + np.sin(2 * np.pi * freq / 2 * np.arange(n) / SR)) * env(n, 0.004, dur * 0.6) * 0.32


def lead(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 6 * t)
    phase = 2 * np.pi * np.cumsum(freq * vib) / SR
    tone = sum(np.sin(phase * h) / h * (0.7 ** h) for h in range(1, 7))
    return tone * env(n, 0.01, dur * 0.8) * 0.16


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = np.diff(rng.uniform(-1, 1, n), prepend=0)
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * (t / dur) ** 2) / SR)
    return (noise * 0.25 + sweep * 0.12) * (t / dur) ** 2


def impact():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-t * 12)) / SR) * np.exp(-t * 3)
    crash = np.diff(rng.uniform(-1, 1, n), prepend=0) * np.exp(-t * 4) * 0.35
    return boom * 0.9 + crash


# D Hijaz: D Eb F# G A Bb C
D = 146.83
hz = lambda semis: D * 2 ** (semis / 12)
HIJAZ = [0, 1, 4, 5, 7, 8, 10, 12]
bars = int(LENGTH / (4 * BEAT)) + 1

# riff: 8 eighth-notes per bar, scale degrees (None = rest)
RIFF_A = [7, None, 6, 5, 4, None, 2, 1]
RIFF_B = [4, 5, 6, None, 7, 6, 5, 4]
BASS = [0, 0, 5, 3]  # scale degrees on each beat of 2-bar cycle alternate

for bar in range(bars):
    t0 = bar * 4 * BEAT
    breakdown = 14.2 <= t0 < 16.0  # thin out before the offer drop
    for b in range(4):
        tb = t0 + b * BEAT
        if not breakdown:
            add(kick(), tb, 0.9)
            bdeg = BASS[b] if bar % 2 == 0 else [0, 0, 1, 0][b]
            add(bass(hz(HIJAZ[bdeg]) / 2, BEAT * 0.9), tb + BEAT / 2, 0.8)
        if b in (1, 3):
            add(clap(), tb, 0.9 if not breakdown else 0.5, pan=0.1)
        for e in range(2):
            add(hat(open_=(e == 1 and b == 3)), tb + e * BEAT / 2, 1.0, pan=-0.3)
    riff = RIFF_A if bar % 2 == 0 else RIFF_B
    if bar >= 1 and not breakdown:
        for k, deg in enumerate(riff):
            if deg is not None:
                f = hz(HIJAZ[deg]) * 2
                add(lead(f, BEAT * 0.48), t0 + k * BEAT / 2, 1.0, pan=0.2)

# snare roll + riser into the offer drop at 16s
for k in range(8):
    add(clap(), 15.0 + k * BEAT / 4, 0.3 + 0.07 * k)
add(riser(1.8), 14.2, 1.0)

for t in (0.0, 16.0, 21.5, 26.0):
    add(impact(), t, 0.8)

# gentle limiter + fade out
peak = np.max(np.abs(mix))
mix = np.tanh(mix / peak * 1.6) * 0.85
fade = int(0.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]

out = sys.argv[1] if len(sys.argv) > 1 else 'beat.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print(f'wrote {out} ({LENGTH}s)')
