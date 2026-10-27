// Promo videosunun özgün fon müziği ve efekt sesleri. Bağımlılıksız Node;
// 16-bit 44.1 kHz stereo WAV yazar (public/audio/). Lisans gerektirmez.
//
//   node scripts/generate-audio.mjs
//
// Parça: 84 BPM, Fa majör, Fmaj7 – Cadd9/E – Dm7 – B♭maj7 döngüsü. Yumuşak pad ve
// elektrik piyano ile açılır; marka anında (≈4,3 sn) bas ve arpej girer; son iki
// ölçü Do → Fmaj7 ile çözülür. Süre videoyla aynı (1209 kare / 30 fps); 1 sn
// fade-in ve 2,2 sn fade-out sayesinde hero'daki döngü yumuşak döner.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");

const DURATION = 1209 / 30;
const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const LIFT = BEAT * 6; // bas ve arpejin girdiği an (marka sahnesi)

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const TAU = Math.PI * 2;

// Akorlar MIDI numarasıyla: bas, pad voicing'i, arpej sesleri.
const CHORDS = {
  F: { bass: 41, pad: [53, 57, 60, 64], arp: [69, 72, 76, 77] },
  C: { bass: 40, pad: [52, 55, 60, 62], arp: [67, 72, 74, 76] },
  Dm: { bass: 38, pad: [50, 53, 57, 60], arp: [65, 69, 72, 74] },
  Bb: { bass: 34, pad: [46, 50, 53, 57], arp: [65, 69, 70, 74] },
  Cres: { bass: 36, pad: [48, 52, 55, 62], arp: [64, 67, 72, 74] },
};
const LOOP = ["F", "C", "Dm", "Bb"];
const totalBars = Math.floor(DURATION / BAR); // son ölçü videonun sonuna kadar uzar
const progression = Array.from({ length: totalBars }, (_, i) => {
  if (i === totalBars - 2) return "Cres";
  if (i === totalBars - 1) return "F";
  return LOOP[i % LOOP.length];
});
const ARP_PATTERN = [0, 2, 1, 3, 2, 1, 3, 1];

function track(seconds) {
  const n = Math.ceil(SR * seconds);
  return { L: new Float32Array(n), R: new Float32Array(n), n };
}

/** Bir sesi `start` saniyesine, `pan` (-1..1) ile dry ve reverb yollarına yazar. */
function place(dry, send, start, length, sendLevel, pan, render) {
  const i0 = Math.floor(start * SR);
  const len = Math.floor(length * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < len; i++) {
    const idx = i0 + i;
    if (idx >= dry.n) break;
    const v = render(i / SR);
    dry.L[idx] += v * gl;
    dry.R[idx] += v * gr;
    if (send) {
      send.L[idx] += v * gl * sendLevel;
      send.R[idx] += v * gr * sendLevel;
    }
  }
}

function pad(dry, send, start, length, midi) {
  const f = hz(midi);
  const tail = 0.9;
  place(dry, send, start, length + tail, 0.35, (midi % 5) / 5 - 0.4, (t) => {
    const attack = Math.min(1, t / 0.7);
    const release = t > length ? Math.exp(-(t - length) / 0.35) : 1;
    const wobble = 1 + 0.08 * Math.sin(TAU * 0.21 * t + midi);
    const tone =
      Math.sin(TAU * f * t) +
      0.6 * Math.sin(TAU * f * 1.0023 * t) +
      0.6 * Math.sin(TAU * f * 0.9977 * t) +
      0.12 * Math.sin(TAU * f * 2 * t);
    return 0.022 * tone * attack * release * wobble;
  });
}

function piano(dry, send, start, midi, gain = 0.07) {
  const f = hz(midi);
  place(dry, send, start, 3.2, 0.5, ((midi % 7) / 7) * 0.6 - 0.3, (t) => {
    const index = 1.1 * Math.exp(-t / 0.35);
    const env = (1 - Math.exp(-t / 0.004)) * Math.exp(-t / 1.3);
    return gain * env * Math.sin(TAU * f * t + index * Math.sin(TAU * f * 2 * t));
  });
}

function pluck(dry, send, start, midi, pan) {
  const f = hz(midi);
  place(dry, send, start, 1.2, 0.6, pan, (t) => {
    const env = (1 - Math.exp(-t / 0.003)) * Math.exp(-t / 0.24);
    return 0.042 * env * (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * f * 2 * t) * Math.exp(-t / 0.08));
  });
}

function bass(dry, start, length, midi) {
  const f = hz(midi);
  place(dry, null, start, length + 0.4, 0, 0, (t) => {
    const attack = Math.min(1, t / 0.06);
    const release = t > length ? Math.exp(-(t - length) / 0.12) : 1;
    return 0.11 * attack * release * (Math.sin(TAU * f * t) + 0.22 * Math.sin(TAU * f * 2 * t));
  });
}

let seed = 7;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 2147483648 - 1;
};

function shaker(dry, start, accent) {
  let prev = 0;
  place(dry, null, start, 0.12, 0, accent ? 0.25 : -0.25, (t) => {
    const n = noise();
    const hp = n - prev; // birinci dereceden yüksek geçiren: parlak, ince ses
    prev = n;
    return (accent ? 0.016 : 0.009) * hp * Math.exp(-t / 0.028);
  });
}

/** Ping-pong gecikme (arpej için), noktalı sekizlik. */
function pingPong(src, time, feedback, mix) {
  const d = Math.floor(time * SR);
  const L = Float32Array.from(src.L);
  const R = Float32Array.from(src.R);
  for (let i = d; i < src.n; i++) {
    L[i] += R[i - d] * feedback + src.L[i - d] * mix;
    R[i] += L[i - d] * feedback;
  }
  return { L, R, n: src.n };
}

/** Freeverb: paralel tarak + seri allpass, iki kanal hafif farklı uzunlukta. */
function freeverb(input, { room = 0.84, damp = 0.25, spread = 23 } = {}) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const allpasses = [556, 441, 341, 225];
  const run = (signal, offset) => {
    const out = new Float32Array(signal.length);
    for (const size of combs) {
      const buf = new Float32Array(size + offset);
      let idx = 0;
      let store = 0;
      for (let i = 0; i < signal.length; i++) {
        const y = buf[idx];
        store = y * (1 - damp) + store * damp;
        buf[idx] = signal[i] * 0.015 + store * room;
        idx = (idx + 1) % buf.length;
        out[i] += y;
      }
    }
    for (const size of allpasses) {
      const buf = new Float32Array(size + offset);
      let idx = 0;
      for (let i = 0; i < out.length; i++) {
        const b = buf[idx];
        const x = out[i];
        buf[idx] = x + b * 0.5;
        out[i] = b - x;
        idx = (idx + 1) % buf.length;
      }
    }
    return out;
  };
  return { L: run(input.L, 0), R: run(input.R, spread), n: input.n };
}

function writeWav(path, L, R) {
  const n = L.length;
  const buffer = Buffer.alloc(44 + n * 4);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + n * 4, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(SR, 24);
  buffer.writeUInt32LE(SR * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  writeFileSync(path, buffer);
}

/** Tepe değeri `peak`e çeker, yumuşak doyum uygular. */
function master(L, R, peak) {
  let max = 0;
  for (let i = 0; i < L.length; i++) {
    L[i] = Math.tanh(L[i] * 1.4) / Math.tanh(1.4);
    R[i] = Math.tanh(R[i] * 1.4) / Math.tanh(1.4);
    max = Math.max(max, Math.abs(L[i]), Math.abs(R[i]));
  }
  const g = peak / max;
  for (let i = 0; i < L.length; i++) {
    L[i] *= g;
    R[i] *= g;
  }
}

function music() {
  const dry = track(DURATION);
  const send = track(DURATION);
  const arp = track(DURATION);
  const arpSend = track(DURATION);

  progression.forEach((name, b) => {
    const chord = CHORDS[name];
    const start = b * BAR;
    const last = b === totalBars - 1;
    const length = last ? DURATION - start : BAR;
    chord.pad.forEach((m) => pad(dry, send, start, length, m));

    // Piyano: ölçü başı ve 3. vuruşun arkası; son akor tek ve uzun.
    const strum = (at, gain) => chord.pad.slice(1).forEach((m, i) => piano(dry, send, at + i * 0.018, m + 12, gain));
    strum(start, last ? 0.08 : 0.065);
    if (!last) strum(start + BEAT * 2.5, 0.045);

    if (start + BAR > LIFT) {
      bass(dry, Math.max(start, LIFT), last ? length - 0.6 : BAR - Math.max(0, LIFT - start) - 0.05, chord.bass);
    }
    if (!last) {
      ARP_PATTERN.forEach((p, k) => {
        const at = start + (k * BEAT) / 2;
        if (at < LIFT) return;
        pluck(arp, arpSend, at, chord.arp[p], k % 2 === 0 ? -0.35 : 0.35);
      });
    }
    if (b >= 4 && b < totalBars - 2) {
      for (let k = 0; k < 8; k++) shaker(dry, start + (k * BEAT) / 2, k % 2 === 1);
    }
  });

  const echoed = pingPong(arp, BEAT * 0.75, 0.32, 0.0);
  for (let i = 0; i < dry.n; i++) {
    dry.L[i] += echoed.L[i];
    dry.R[i] += echoed.R[i];
    send.L[i] += arpSend.L[i];
    send.R[i] += arpSend.R[i];
  }

  const wet = freeverb(send);
  const L = new Float32Array(dry.n);
  const R = new Float32Array(dry.n);
  const fadeIn = 1.0;
  const fadeOut = 2.2;
  for (let i = 0; i < dry.n; i++) {
    const t = i / SR;
    const fade = Math.min(1, t / fadeIn, Math.max(0, (DURATION - t) / fadeOut));
    L[i] = (dry.L[i] + wet.L[i] * 0.9) * fade;
    R[i] = (dry.R[i] + wet.R[i] * 0.9) * fade;
  }
  master(L, R, 0.89);
  return { L, R };
}

function tap() {
  const out = track(0.12);
  let low = 0;
  for (let i = 0; i < out.n; i++) {
    const t = i / SR;
    low += (noise() - low) * 0.25;
    const v = low * Math.exp(-t / 0.006) * 0.9 + 0.35 * Math.sin(TAU * 1700 * t) * Math.exp(-t / 0.018);
    out.L[i] = v;
    out.R[i] = v;
  }
  master(out.L, out.R, 0.5);
  return out;
}

function chime() {
  const out = track(1.4);
  [
    [84, 0],
    [91, 0.09],
  ].forEach(([m, at]) => {
    const f = hz(m);
    place(out, null, at, 1.3, 0, 0, (t) => {
      const env = (1 - Math.exp(-t / 0.002)) * Math.exp(-t / 0.45);
      return env * (Math.sin(TAU * f * t) + 0.18 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.15));
    });
  });
  master(out.L, out.R, 0.4);
  return out;
}

mkdirSync(OUT, { recursive: true });
const m = music();
writeWav(join(OUT, "klinara-calm.wav"), m.L, m.R);
const t = tap();
writeWav(join(OUT, "sfx-tap.wav"), t.L, t.R);
const c = chime();
writeWav(join(OUT, "sfx-chime.wav"), c.L, c.R);
console.log(`Yazıldı: ${OUT} (müzik ${DURATION.toFixed(2)} sn, ${totalBars} ölçü: ${progression.join(" ")})`);
