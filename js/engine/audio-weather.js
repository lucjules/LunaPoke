// Météo et musique
function wx() {
  const m = maps[G.map];
  if (!S.meteo || !m || m.in || m.w) return 'clair';
  const e = Math.floor(Date.now() / 240000),
    r = (Math.imul(e + 7, 2654435761) >>> 0) % 100;
  return r < 20 ? 'pluie' : r < 30 ? 'brume' : 'clair';
}
const wb = c => (wx() == 'pluie' ? (c == 'E' ? 1.25 : c == 'F' ? 0.75 : 1) : 1);
function drawWx(t, m) {
  const w = wx();
  if (w == 'pluie') {
    cx.fillStyle = 'rgba(40,60,100,.2)';
    cx.fillRect(0, 0, 480, VHH);
    if (Q.fx) {
      cx.strokeStyle = 'rgba(190,210,255,.5)';
      cx.lineWidth = 1;
      cx.beginPath();
      const n = Q.fx == 2 ? 70 : 34;
      for (let i = 0; i < n; i++) {
        const x = (i * 67.3) % 480,
          y = ((t * 0.45 + i * 41) % 340) - 10;
        cx.moveTo(x, y);
        cx.lineTo(x - 3, y + 9);
      }
      cx.stroke();
    }
  } else if (w == 'brume') {
    cx.fillStyle = 'rgba(225,232,240,.24)';
    cx.fillRect(0, 0, 480, VHH);
  }
}
let lastW = 'clair';
setInterval(() => {
  const w = wx();
  if (w != lastW && !busy) {
    lastW = w;
    toast(
      w == 'pluie'
        ? '🌧 La pluie commence : Eau +25%, Feu −25% en combat.'
        : w == 'brume'
          ? '🌫 Une brume légère se lève.'
          : '⛅ Le ciel se dégage.'
    );
  } else lastW = w;
}, 5000);
let ac,
  mus = 0,
  mt;
// ---------- Musique : petit séquenceur à plusieurs voix ----------
// Chaque morceau dure 8 mesures. mel : une note par croche, en degrés de la gamme
// (1 à 7 ; ' = octave au-dessus, , = octave en dessous ; - prolonge la note, . = silence).
// ch : accord de chaque mesure (degré de la gamme). bass : '8' rebondissante, '4' noires,
// '2' blanches, 'drive' croches. arp : arpèges en doubles croches ; pad : accords tenus ;
// dr : percussions ('soft', 'beat', 'march') ; echo : écho sur la mélodie.
const SCALES = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10] };
const TRK = {
  town: {
    bpm: 112,
    root: 60,
    sc: 'maj',
    ch: [1, 5, 6, 4, 1, 4, 5, 1],
    lead: 'square',
    cut: 2600,
    bass: '8',
    arp: 1,
    dr: 'soft',
    mel: "5 - 3 5 1' - 7 - | 6 5 - 4 2 - 5 - | 6 - 1' 6 5 - 3 - | 4 5 6 - 5 4 3 2 | 3 - 5 - 1' 2' 3' - | 2' 1' 6 - 4 - 6 1' | 7 - 2' - 5 6 7 - | 1' - 5 - 3 - 1 -"
  },
  route: {
    bpm: 132,
    root: 55,
    sc: 'maj',
    ch: [1, 4, 5, 1, 6, 4, 5, 5],
    lead: 'square',
    cut: 3200,
    bass: '8',
    arp: 1,
    dr: 'beat',
    mel: "1 2 3 5 - 3 5 1' | 6 - 4 6 1' - 6 - | 7 - 5 7 2' - 1' 7 | 1' - 5 - 3 - - - | 3' - 2' 1' 6 - 1' - | 4' - 3' 2' 1' - 6 - | 2' - 1' 7 5 - 6 7 | 2' - - - 7 - 5 -"
  },
  forest: {
    bpm: 100,
    root: 57,
    sc: 'min',
    ch: [1, 6, 3, 7, 1, 4, 7, 1],
    lead: 'triangle',
    cut: 2200,
    bass: '4',
    pad: 1,
    dr: 'soft',
    echo: 1,
    mel: "1 - 3 - 5 - 4 3 | 1 - 6, 1 3 - 2 1 | 3 - 5 - 7 - 5 - | 7, - 2 - 4 - 2 - | 5 - 4 3 1 - 3 5 | 4 - 6 - 1' - 6 4 | 2' - 7 - 5 - 4 2 | 1 - - - . . . ."
  },
  mountain: {
    bpm: 116,
    root: 50,
    sc: 'min',
    ch: [1, 7, 6, 5, 1, 7, 6, 7],
    lead: 'square',
    cut: 2400,
    bass: '2',
    pad: 1,
    dr: 'march',
    mel: "1 - 5 - 1' - 7 - | 7 - 4 - 2' - 1' 7 | 6 - 3 - 1' - 6 - | 5 - 7, - 2 - 5 - | 1' - 7 1' 5 - 3 - | 4 5 7 - 2' - 7 - | 1' 7 6 - 3 4 6 - | 7 - - - 5 - 2 -"
  },
  sea: {
    bpm: 104,
    root: 53,
    sc: 'maj',
    ch: [1, 6, 4, 5, 1, 3, 4, 5],
    lead: 'triangle',
    cut: 2800,
    bass: '8',
    arp: 1,
    dr: 'soft',
    echo: 1,
    mel: "5 - - 6 5 - 3 - | 1' - - 7 6 - 3 - | 4 - 6 - 1' - 6 - | 5 - - - 2 - 5 - | 3' - 2' - 1' - 5 - | 7 - 5 - 3 - 5 - | 6 - 1' - 4' - 3' 2' | 2' - - - 5 - 7 -"
  },
  fire: {
    bpm: 126,
    root: 52,
    sc: 'min',
    ch: [1, 6, 7, 1, 1, 6, 7, 1],
    lead: 'sawtooth',
    cut: 1800,
    bass: 'drive',
    dr: 'beat',
    mel: "1 1 3 - 1 1 5 - | 6 - 5 - 3 - 1 - | 7, 7, 2 - 4 - 2 - | 1 - 3 5 1' - - - | 5 6 5 3 1 - 3 - | 6 7 6 5 3 - 1 - | 2 - 4 - 7 - 6 5 | 1 - - - 5, - 1 -"
  },
  star: {
    bpm: 92,
    root: 58,
    sc: 'maj',
    ch: [1, 3, 4, 1, 6, 4, 2, 5],
    lead: 'triangle',
    cut: 3000,
    bass: '2',
    pad: 1,
    arp: 1,
    echo: 1,
    mel: "5' - - - 3' - - - | 7 - - - 5 - 3 - | 6 - 1' - 4' - - - | 3' - 2' - 1' - - - | 1' - 3' - 6' - 5' - | 4' - - - 1' - 6 - | 2' - 4' - 6' - 5' 4' | 2' - - - - - . ."
  },
  cave: {
    bpm: 84,
    root: 48,
    sc: 'min',
    ch: [1, 4, 1, 5, 6, 4, 5, 1],
    lead: 'sine',
    cut: 1600,
    bass: '2',
    pad: 1,
    echo: 1,
    mel: "1' - - - . . 7 - | 6 - - - . . 4 - | 5 - - - 3 - - - | 2 - - - . . . . | 1' - 3' - - - 2' - | 1' - 6 - - - 4 - | 5 - 4 - 2 - 7, - | 1 - - - . . . ."
  },
  night: {
    bpm: 76,
    root: 56,
    sc: 'maj',
    ch: [1, 6, 4, 5, 1, 3, 6, 5],
    lead: 'sine',
    cut: 2000,
    bass: '2',
    pad: 1,
    echo: 1,
    mel: "3 - - 5 1' - - - | 1' - - 7 6 - - - | 4 - 6 - 1' - 6 - | 5 - - - . . . . | 3 - 5 - 1' - 2' - | 3' - 2' - 7 - 5 - | 6 - 1' - 3' - 2' - | 2' - - - 7 - - -"
  },
  battle: {
    bpm: 168,
    root: 57,
    sc: 'min',
    ch: [1, 6, 7, 1, 1, 6, 7, 5],
    lead: 'sawtooth',
    cut: 2600,
    bass: 'drive',
    dr: 'beat',
    mel: "1' 7 1' 5 3 5 1' 2' | 3' 2' 1' 6 4 6 1' - | 2' 1' 7 5 2 5 7 2' | 1' - 5 - 1' - 3' - | 5' 4' 3' 1' 5 1' 3' 5' | 4' 3' 1' 6 3 6 1' 4' | 3' 2' 7 5 2 5 7 2' | 2' - 7 - 5 - 7 -"
  },
  boss: {
    bpm: 180,
    root: 50,
    sc: 'min',
    ch: [1, 1, 6, 7, 1, 4, 5, 1],
    lead: 'sawtooth',
    cut: 3000,
    bass: 'drive',
    arp: 1,
    dr: 'beat',
    mel: "1 1' 1 1' 7 1' 5 3 | 1 1' 1 1' 2' 1' 7 5 | 6 1' 3' 1' 6 1' 3' 6' | 7 2' 4' 2' 7 2' 4' 7' | 5' - 3' - 1' - 5 - | 6' - 4' - 1' - 4 - | 5' 4' 2' 7 5 7 2' 4' | 3' 2' 1' 7 1' - - -"
  },
  legend: {
    bpm: 150,
    root: 52,
    sc: 'min',
    ch: [1, 6, 3, 7, 4, 1, 6, 5],
    lead: 'square',
    cut: 2800,
    bass: '4',
    pad: 1,
    dr: 'march',
    echo: 1,
    mel: "1 - 5 - 1' - 3' - | 1' - - 7 6 - 3 - | 3 - 5 - 7 - 3' - | 2' - - 1' 7 - 5 - | 4 - 6 - 1' - 4' - | 3' - 2' 1' 5 - 1' - | 1' 7 6 - 3' 2' 1' - | 7 - - - 2' - 5 -"
  }
};
// mélodie : une case par croche, { n: [degré, octave], d: durée en croches } ou null
for (const k in TRK) {
  const tk = TRK[k].mel.replace(/\|/g, ' ').trim().split(/\s+/),
    out = [];
  tk.forEach((t, i) => {
    const m = /^([1-7])('*)(,*)$/.exec(t);
    if (!m) return out.push(null);
    let d = 1;
    while (tk[i + d] == '-') d++;
    out.push({ n: [+m[1], m[2].length - m[3].length], d });
  });
  TRK[k].notes = out;
}
const LEGENDS = [16, 43, 50, 98, 99];
const MUS_TH = {
  plain: 'route',
  meadow: 'route',
  dawn: 'route',
  forest: 'forest',
  autumn: 'forest',
  mist: 'forest',
  swamp: 'forest',
  mountain: 'mountain',
  snow: 'mountain',
  ruins: 'mountain',
  lake: 'sea',
  coast: 'sea',
  beach: 'sea',
  tropical: 'sea',
  volcano: 'fire',
  desert: 'fire',
  star: 'star'
};
const trackFor = () => {
  if ($('bt').style.display == 'flex') {
    const t = (B && B.t) || '';
    if (
      /Vesper|Corbin|Noa|Ilex|Mira|Granit|Zéphyr|Aurion|Éclipse|Brasier|Névé|Aurore|Zénith|Flora|Nérée|Cendra|Bora|Sablon|Ronce|Houle|Solène|Perle|Aéris|Sylvane|Orion/.test(
        t
      )
    )
      return 'boss';
    return !t && B && B.f.some(f => LEGENDS.includes(f.s)) ? 'legend' : 'battle';
  }
  const m = maps[G.map];
  if (m.k == 'cave') return 'cave';
  if (m.k == 'secret') return 'star';
  const h = new Date().getHours();
  if (!m.in && (h >= 21 || h < 6)) return 'night';
  if (m.in || m.tn) return 'town';
  return MUS_TH[m.th] || 'route';
};
// fréquence d'un degré de la gamme du morceau (oct : décalage d'octave)
const degHz = (T, deg, oct) => {
  const sc = SCALES[T.sc],
    i = deg - 1;
  return 440 * 2 ** ((T.root + 12 * (oct + Math.floor(i / 7)) + sc[((i % 7) + 7) % 7] - 69) / 12);
};
let musNoise = null;
// programme les notes de la double croche s (0 à 127) du morceau T, à l'instant t
function musStep(ctx, out, T, s, t) {
  const sx = 60 / T.bpm / 4,
    bar = Math.floor(s / 16) % 8,
    pos = s % 16,
    ch = T.ch[bar],
    tone = (f, type, v, start, dur, cut, att = 0.006) => {
      const o = ctx.createOscillator(),
        g = ctx.createGain(),
        lp = ctx.createBiquadFilter();
      o.type = type;
      o.frequency.value = f;
      lp.type = 'lowpass';
      lp.frequency.value = cut || 4000;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(v, start + att);
      g.gain.exponentialRampToValueAtTime(v * 0.6, start + Math.min(dur, 0.12));
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(lp);
      lp.connect(g);
      g.connect(out);
      o.start(start);
      o.stop(start + dur + 0.02);
    },
    noise = (v, start, dur, hp) => {
      if (!musNoise || musNoise.sampleRate != ctx.sampleRate) {
        musNoise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const d = musNoise.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const n = ctx.createBufferSource(),
        f = ctx.createBiquadFilter(),
        g = ctx.createGain();
      n.buffer = musNoise;
      f.type = 'highpass';
      f.frequency.value = hp;
      g.gain.setValueAtTime(v, start);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      n.connect(f);
      f.connect(g);
      g.connect(out);
      n.start(start, Math.random() * 0.5);
      n.stop(start + dur + 0.02);
    };
  // mélodie (une note par croche)
  if (pos % 2 == 0) {
    const nt = T.notes[(bar * 8 + pos / 2) % T.notes.length];
    if (nt) {
      const f = degHz(T, nt.n[0], nt.n[1]),
        d = nt.d * 2 * sx * 0.95;
      tone(f, T.lead, T.lead == 'sine' || T.lead == 'triangle' ? 0.2 : 0.1, t, d, T.cut);
      if (T.echo) tone(f, T.lead, 0.04, t + sx * 3, d, T.cut * 0.7);
    }
  }
  // basse
  const root = degHz(T, ch, -2),
    fifth = degHz(T, ch + 4, -2),
    bs = { 8: [0, 4, 8, 12], 4: [0, 4, 8, 12], 2: [0, 8], drive: [0, 2, 4, 6, 8, 10, 12, 14] }[T.bass] || [
      0, 8
    ];
  if (bs.includes(pos)) {
    const alt = T.bass == '8' || T.bass == '4' ? pos % 8 == 4 : false;
    tone(
      alt ? fifth : root,
      'triangle',
      0.22,
      t,
      sx * ({ 2: 7.5, 4: 3.6, 8: 1.8, drive: 1.6 }[T.bass] || 3),
      900
    );
  }
  if (T.bass == '8' && (pos == 2 || pos == 10)) tone(root * 2, 'triangle', 0.1, t, sx * 1.5, 900);
  // arpèges / accords tenus
  if (T.arp && pos % 2 == 1)
    tone(degHz(T, ch + [0, 2, 4, 2][(pos >> 1) % 4], 1), 'square', 0.025, t, sx * 1.2, 2400);
  if (T.pad && pos == 0)
    [0, 2, 4].forEach(k => tone(degHz(T, ch + k, 0), 'triangle', 0.035, t, sx * 15.5, 1400, 0.3));
  // percussions
  if (T.dr) {
    if (pos % 2 == 0) noise(pos % 4 == 2 ? 0.05 : 0.025, t, 0.04, 7000);
    if (T.dr != 'soft' && (pos == 0 || pos == 8 || (T.dr == 'march' && pos % 4 == 0))) {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      o.connect(g);
      g.connect(out);
      o.start(t);
      o.stop(t + 0.16);
    }
    if (T.dr == 'beat' && (pos == 4 || pos == 12)) noise(0.12, t, 0.12, 1500);
  }
}
let musOut = null;
function music() {
  if (mus) {
    clearInterval(mt);
    mus = 0;
    return;
  }
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  if (!musOut) {
    musOut = ac.createGain();
    musOut.connect(ac.destination);
  }
  mus = 1;
  let s = 0,
    cur = '',
    next = ac.currentTime + 0.1;
  // programmation en avance de 0,15 s, vérifiée toutes les 25 ms
  mt = setInterval(() => {
    musOut.gain.value = 0.06 * (S.vol || 0);
    if (!S.vol) return;
    if (next < ac.currentTime) next = ac.currentTime + 0.05; // après une pause : pas de rattrapage
    while (next < ac.currentTime + 0.15) {
      const k = trackFor(),
        T = TRK[k];
      if (k != cur) {
        cur = k;
        s = 0;
        next = Math.max(next, ac.currentTime + 0.05);
      }
      musStep(ac, musOut, T, s, next);
      next += 60 / T.bpm / 4;
      s = (s + 1) % 128;
    }
  }, 25);
}
