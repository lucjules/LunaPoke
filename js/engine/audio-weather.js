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
const TRK = {
  town: { n: [0, 4, 7, 12, 9, 7, 4, 2, 0, 4, 7, 9, 12, 9, 7, 4], bpm: 190, t: 'triangle', r: 196 },
  route: { n: [0, 2, 4, 7, 4, 2, 0, -3, 0, 2, 4, 7, 9, 7, 4, 2], bpm: 230, t: 'square', r: 220 },
  battle: { n: [0, 0, 7, 0, 5, 0, 3, 0, 0, 0, 7, 0, 8, 7, 5, 3], bpm: 320, t: 'sawtooth', r: 164 },
  boss: { n: [0, 0, 3, 0, 7, 0, 6, 5, 0, 0, 3, 0, 8, 7, 6, 3], bpm: 340, t: 'sawtooth', r: 146 },
  cave: { n: [0, 3, 7, 3, 0, -2, 3, 7, null, 3, 0, 3, 5, 3, 0, null], bpm: 150, t: 'sine', r: 130 },
  night: { n: [0, 4, 7, 4, 0, 4, 9, 7, 0, 4, 7, 12, 9, 7, 4, 0], bpm: 130, t: 'sine', r: 174 }
};
const trackFor = () => {
  if ($('bt').style.display == 'flex') {
    const t = (B && B.t) || '';
    return /Vesper|Corbin|Noa|Ilex|Mira|Granit|Zéphyr|Aurion|Éclipse|Brasier|Névé|Aurore|Zénith|Flora|Nérée|Cendra|Bora|Sablon|Ronce|Houle|Solène|Perle|Aéris|Sylvane|Orion/.test(
      t
    )
      ? 'boss'
      : 'battle';
  }
  const m = maps[G.map];
  if (m.k == 'cave') return 'cave';
  const h = new Date().getHours();
  if (!m.in && (h >= 21 || h < 6)) return 'night';
  return m.in || m.tn ? 'town' : 'route';
};
function music() {
  if (mus) {
    clearTimeout(mt);
    mus = 0;
    return;
  }
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  mus = 1;
  let i = 0,
    cur = '';
  const loop = () => {
    if (!mus) return;
    const k = trackFor(),
      T = TRK[k];
    if (k != cur) {
      cur = k;
      i = 0;
    }
    const n = T.n[i % T.n.length];
    if (n != null && S.vol) {
      const note = (f, ty, v, d) => {
        const o = ac.createOscillator(),
          g = ac.createGain();
        o.type = ty;
        o.frequency.value = f;
        g.gain.value = Math.max(0.0001, v * S.vol);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
        o.connect(g);
        g.connect(ac.destination);
        o.start();
        o.stop(ac.currentTime + d + 0.02);
      };
      note(T.r * 2 ** (n / 12), T.t, 0.008, 0.28);
      if (i % 4 == 0) note((T.r / 2) * 2 ** (n / 12), 'triangle', 0.01, 0.5);
    }
    i++;
    mt = setTimeout(loop, 60000 / T.bpm);
  };
  loop();
}
