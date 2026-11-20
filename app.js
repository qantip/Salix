(() => {
  'use strict';

  // ---------- Letter data (Latin equivalents use Czech transliteration) ----------
  const L = (id, up, lo, lat, langs, note = '') => ({ id, up, lo, lat, langs: langs.split(' '), note });
  const LETTERS = [
    L('a', 'А', 'а', 'a', 'ru uk'),
    L('b', 'Б', 'б', 'b', 'ru uk'),
    L('v', 'В', 'в', 'v', 'ru uk', 'Looks like Latin B, but reads as v.'),
    L('g-ru', 'Г', 'г', 'g', 'ru', 'Russian Г is a hard g, as in Czech "guma".'),
    L('h-uk', 'Г', 'г', 'h', 'uk', 'Ukrainian Г is a voiced h, as in Czech "hora".'),
    L('g-uk', 'Ґ', 'ґ', 'g', 'uk', 'Hard g, as in Czech "guma". Fairly rare.'),
    L('d', 'Д', 'д', 'd', 'ru uk', 'The capital has small "feet" that drop below the baseline.'),
    L('e', 'Е', 'е', 'e', 'ru uk', 'Russian: pronounced "je" at the start of a word and after vowels. Ukrainian: a plain e.'),
    L('jo', 'Ё', 'ё', 'jo', 'ru', 'Always stressed. In normal texts often written without the dots, as Е.'),
    L('je', 'Є', 'є', 'je', 'uk'),
    L('zh', 'Ж', 'ж', 'ž', 'ru uk'),
    L('z', 'З', 'з', 'z', 'ru uk', 'Looks like the digit 3.'),
    L('i-ru', 'И', 'и', 'i', 'ru', 'Russian И is a Czech i. Looks like a mirrored Latin N.'),
    L('y-uk', 'И', 'и', 'y', 'uk', 'Ukrainian И sounds close to Czech y.'),
    L('i-uk', 'І', 'і', 'i', 'uk', 'Ukrainian І is a Czech i.'),
    L('ji', 'Ї', 'ї', 'ji', 'uk'),
    L('j', 'Й', 'й', 'j', 'ru uk', 'И with a breve on top.'),
    L('k', 'К', 'к', 'k', 'ru uk'),
    L('l', 'Л', 'л', 'l', 'ru uk'),
    L('m', 'М', 'м', 'm', 'ru uk'),
    L('n', 'Н', 'н', 'n', 'ru uk', 'Looks like Latin H, but reads as n.'),
    L('o', 'О', 'о', 'o', 'ru uk'),
    L('p', 'П', 'п', 'p', 'ru uk'),
    L('r', 'Р', 'р', 'r', 'ru uk', 'Looks like Latin P, but reads as r.'),
    L('s', 'С', 'с', 's', 'ru uk', 'Looks like Latin C, but reads as s.'),
    L('t', 'Т', 'т', 't', 'ru uk'),
    L('u', 'У', 'у', 'u', 'ru uk', 'Looks like Latin Y, but reads as u.'),
    L('f', 'Ф', 'ф', 'f', 'ru uk', 'The lowercase rises above the x-height and drops below the baseline.'),
    L('ch', 'Х', 'х', 'ch', 'ru uk', 'Looks like Latin X, but reads as ch.'),
    L('c', 'Ц', 'ц', 'c', 'ru uk', 'Note the small tail below the baseline.'),
    L('cz', 'Ч', 'ч', 'č', 'ru uk'),
    L('sz', 'Ш', 'ш', 'š', 'ru uk'),
    L('szcz', 'Щ', 'щ', 'šč', 'ru uk', 'Ш with a tail. Russian: a long soft š. Ukrainian: šč.'),
    L('hard', 'Ъ', 'ъ', 'ʺ', 'ru', 'Hard sign — silent. Separates a consonant from a following е, ё, ю, я.'),
    L('y-ru', 'Ы', 'ы', 'y', 'ru', 'Like Czech y, but pronounced further back in the mouth.'),
    L('soft', 'Ь', 'ь', 'ʹ', 'ru uk', 'Soft sign — silent. Softens the preceding consonant (like ď, ť, ň).'),
    L('e-ru', 'Э', 'э', 'è', 'ru', 'A plain e, as in Czech "eso". Written è to tell it apart from Е.'),
    L('ju', 'Ю', 'ю', 'ju', 'ru uk'),
    L('ja', 'Я', 'я', 'ja', 'ru uk', 'Looks like a mirrored Latin R.'),
  ];
  const BY_ID = Object.fromEntries(LETTERS.map(l => [l.id, l]));

  // What the speech engine says for each letter: [Russian, Ukrainian] letter name.
  // Ukrainian-only letters have a Russian approximation used when no Ukrainian voice is installed
  // (null = no faithful Russian equivalent, e.g. Ukrainian Г = h).
  const SAY = {
    a: ['а', 'а'], b: ['бэ', 'бе'], v: ['вэ', 'ве'], 'g-ru': ['гэ', null], 'h-uk': [null, 'ге'],
    'g-uk': ['гэ', 'ґе'], d: ['дэ', 'де'], e: ['е', 'е'], jo: ['ё', null], je: ['е', 'є'],
    zh: ['жэ', 'же'], z: ['зэ', 'зе'], 'i-ru': ['и', null], 'y-uk': ['ы', 'и'], 'i-uk': ['и', 'і'],
    ji: ['йи', 'ї'], j: ['и краткое', 'йот'], k: ['ка', 'ка'], l: ['эль', 'ел'], m: ['эм', 'ем'],
    n: ['эн', 'ен'], o: ['о', 'о'], p: ['пэ', 'пе'], r: ['эр', 'ер'], s: ['эс', 'ес'], t: ['тэ', 'те'],
    u: ['у', 'у'], f: ['эф', 'еф'], ch: ['ха', 'ха'], c: ['цэ', 'це'], cz: ['че', 'че'], sz: ['ша', 'ша'],
    szcz: ['ща', 'ща'], hard: ['твёрдый знак', null], 'y-ru': ['ы', null], soft: ['мягкий знак', 'мʼякий знак'],
    'e-ru': ['э', null], ju: ['ю', 'ю'], ja: ['я', 'я'],
  };
  const LANG_LABEL = { ru: 'RU', uk: 'UA' };
  const HINTS = { 'ʹ': 'soft sign', 'ʺ': 'hard sign' };
  const MODES = {
    cyr: { title: 'Cyrillic → Latin', prompt: 'Pick the matching Latin letter' },
    lat: { title: 'Latin → Cyrillic', prompt: 'Pick the matching Cyrillic letter' },
  };

  // ---------- Icons (Carbon, 32px grid) ----------
  const icon = d => `<svg viewBox="0 0 32 32" aria-hidden="true">${d}</svg>`;
  const I = {
    check: icon('<path d="M13 24l-9-9 1.41-1.41L13 21.17 26.59 7.59 28 9 13 24z"/>'),
    checkFilled: icon('<path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm-2 19.59l-5-5L10.59 15 14 18.41 21.41 11l1.6 1.59z"/>'),
    errorFilled: icon('<path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm5.41 18L20 21.41l-4-4-4 4L10.59 20l4-4-4-4L12 10.59l4 4 4-4L21.41 12l-4 4z"/>'),
    close: icon('<path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"/>'),
    right: icon('<path d="M18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10L18 6z"/>'),
    left: icon('<path d="M14 26l1.41-1.41L7.83 17H28v-2H7.83l7.58-7.59L14 6 4 16l10 10z"/>'),
    add: icon('<path d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z"/>'),
    sub: icon('<path d="M8 15h16v2H8z"/>'),
    restart: icon('<path d="M18 28A12 12 0 106 16v6.2l-3.6-3.6L1 20l6 6 6-6-1.4-1.4L8 22.2V16a10 10 0 1110 10z"/>'),
    sound: icon('<path d="M27.16 8.08l-1.53 1.29a10 10 0 01-.29 13.23l1.47 1.36a12 12 0 00.35-15.88z"/><path d="M21.58 12a6 6 0 01-.18 7.94l1.47 1.36a8 8 0 00.23-10.59z"/><path d="M18 30a1 1 0 01-.71-.3L9.67 22H3a1 1 0 01-1-1V11a1 1 0 011-1h6.67l7.62-7.7a1 1 0 011.41 0A1 1 0 0119 3v26a1 1 0 01-1 1zM4 20h6.08a1 1 0 01.71.3L17 26.57V5.43L10.79 11.7a1 1 0 01-.71.3H4z"/>'),
    warning: icon('<path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm-1.1 6h2.2v11h-2.2zM16 25a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0116 25z"/>'),
  };

  // ---------- Storage ----------
  const KEY = 'azbuka.v1.';
  const load = (k, def) => { try { const v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : def; } catch { return def; } };
  const save = (k, v) => { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

  const FONTS = {
    sans: { label: 'Sans', note: 'IBM Plex Sans', style: 'normal', family: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif' },
    serif: { label: 'Serif', note: 'IBM Plex Serif', style: 'normal', family: '"IBM Plex Serif", Georgia, serif' },
    italic: { label: 'Italic', note: 'Printed italic — uses cursive shapes', style: 'italic', family: '"IBM Plex Serif", Georgia, serif' },
    hand: { label: 'Handwritten', note: 'Marck Script', style: 'normal', family: '"Marck Script", "Bad Script", cursive' },
    hand2: { label: 'Handwritten 2', note: 'Bad Script', style: 'normal', family: '"Bad Script", "Marck Script", cursive' },
  };
  const OPTION_COUNTS = [2, 4, 6, 8, 10];
  const REVEAL_DELAYS = [0, 1, 2, 3, 5, 10];

  const DEFAULTS = {
    count: 20, optionCount: 4, letterCase: 'upper', autoNext: true, guides: true,
    font: 'sans', theme: 'system', learnShuffle: false, revealDelay: 0,
    sharedVoice: 'ru', soundLearn: false, soundQuiz: false,
    selected: LETTERS.map(l => l.id),
  };
  const settings = Object.assign({}, DEFAULTS, load('settings', {}));
  settings.selected = settings.selected.filter(id => BY_ID[id]);
  if (!FONTS[settings.font]) settings.font = DEFAULTS.font;
  if (!OPTION_COUNTS.includes(settings.optionCount)) settings.optionCount = DEFAULTS.optionCount;
  if (!REVEAL_DELAYS.includes(settings.revealDelay)) settings.revealDelay = DEFAULTS.revealDelay;
  let history = load('history', []);

  const saveSettings = () => save('settings', settings);
  const applyTheme = () => {
    if (settings.theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', settings.theme);
  };

  // ---------- Helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const main = $('#main');
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
  const latOf = (l, up) => (up ? capFirst(l.lat) : l.lat);
  const cyrOf = (l, up) => (up ? l.up : l.lo);
  const pool = () => LETTERS.filter(l => settings.selected.includes(l.id));
  // Cyrillic is drawn in the chosen font; Latin always stays in plain print (sans).
  const glyphFont = () => FONTS[settings.font] || FONTS.sans;
  const fontStyle = f => `style="font-family:${f.family.replace(/"/g, '&quot;')};font-style:${f.style}"`;
  const langTags = l => `<span class="tags">${l.langs.map(g => `<span class="tag tag--${g}">${LANG_LABEL[g]}</span>`).join('')}</span>`;
  const pctColor = p => (p >= 80 ? 'var(--success)' : p >= 50 ? 'var(--warning)' : 'var(--error)');
  const fmtDur = s => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`);

  // ---------- Speech (browser text-to-speech) ----------
  const TTS = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voices = [];
  const loadVoices = () => { if (TTS) voices = TTS.getVoices(); };
  // Prefer the higher quality neural / online voices when several are installed.
  const voiceFor = lang => {
    const list = voices.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(lang));
    return list.find(v => /natural|online|neural|google/i.test(v.name)) || list[0] || null;
  };

  // Returns { text, voice, lang, approx } or null when this letter cannot be pronounced faithfully.
  function speechFor(l) {
    if (!TTS) return null;
    const say = SAY[l.id];
    const ru = voiceFor('ru'), uk = voiceFor('uk');
    const shared = l.langs.length === 2;
    let order = shared ? (settings.sharedVoice === 'uk' ? ['uk', 'ru'] : ['ru', 'uk']) : l.langs;
    if (l.langs[0] === 'uk' && !shared) order = ['uk', 'ru'];
    for (const lang of order) {
      const text = say[lang === 'ru' ? 0 : 1];
      const voice = lang === 'ru' ? ru : uk;
      if (text && voice) return { text, voice, lang, approx: !l.langs.includes(lang) };
    }
    return null;
  }

  function speak(l) {
    const s = speechFor(l);
    if (!s) return;
    TTS.cancel();
    const u = new SpeechSynthesisUtterance(s.text);
    u.voice = s.voice;
    u.lang = s.voice.lang;
    u.rate = 0.8;
    TTS.speak(u);
  }

  const soundBtn = (l, extra = '') => {
    if (!TTS) return '';
    const s = speechFor(l);
    const title = !s
      ? (voices.length ? 'No suitable voice installed for this letter' : 'Loading voices…')
      : `Play sound${s.approx ? ' (approximated with a Russian voice)' : ''}`;
    return `<button class="icon-btn ${extra}" data-say="${l.id}" title="${title}" aria-label="${title}" ${s ? '' : 'disabled'}>${I.sound}</button>`;
  };
  // Re-enable buttons rendered before the voice list arrived (Chrome loads voices asynchronously).
  const refreshSoundButtons = () => $$('[data-say]').forEach(b => {
    const tmp = document.createElement('div');
    tmp.innerHTML = soundBtn(BY_ID[b.dataset.say], b.className.replace('icon-btn', '').trim());
    const nb = tmp.firstElementChild;
    b.disabled = nb.disabled; b.title = nb.title; b.setAttribute('aria-label', nb.title);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b && !b.disabled) { e.preventDefault(); e.stopPropagation(); speak(BY_ID[b.dataset.say]); }
  }, true);

  // ---------- Glyph renderer with typographic guide lines ----------
  function drawGlyph(cv) {
    const text = cv.dataset.glyph;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const css = getComputedStyle(document.documentElement);
    const color = n => css.getPropertyValue(n).trim();
    const font = cv.dataset.font === 'lat' ? FONTS.sans : glyphFont();
    const fontAt = fs => `${font.style} 400 ${fs}px ${font.family}`;
    const guides = settings.guides;

    const measure = fs => {
      ctx.font = fontAt(fs);
      const H = ctx.measureText('H'), x = ctx.measureText('x'), p = ctx.measureText('p'), t = ctx.measureText(text);
      return {
        cap: H.actualBoundingBoxAscent,
        xh: x.actualBoundingBoxAscent,
        desc: p.actualBoundingBoxDescent,
        top: Math.max(H.actualBoundingBoxAscent * 1.08, t.actualBoundingBoxAscent),
        bot: Math.max(p.actualBoundingBoxDescent, t.actualBoundingBoxDescent),
        width: Math.max(t.width, t.actualBoundingBoxLeft + t.actualBoundingBoxRight),
      };
    };

    const padTop = 40, padBottom = cv.dataset.caption ? 36 : 20, labelW = guides ? 72 : 24;
    let m = measure(100);
    const fs = Math.min(
      100 * (h - padTop - padBottom) / (m.top + m.bot),
      100 * (w - 2 * labelW) / m.width,
      220,
    );
    m = measure(fs);
    const avail = h - padTop - padBottom;
    const base = Math.round(padTop + m.top + (avail - (m.top + m.bot)) / 2) + 0.5;

    if (guides) {
      const lines = [
        { y: base - m.cap, label: 'cap height', dash: [4, 4] },
        { y: base - m.xh, label: 'x-height', dash: [4, 4] },
        { y: base, label: 'baseline', dash: [], base: true },
        { y: base + m.desc, label: 'descender', dash: [2, 4] },
      ];
      ctx.font = `400 11px "IBM Plex Sans", sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      for (const ln of lines) {
        const y = Math.round(ln.y) + 0.5;
        ctx.setLineDash(ln.dash);
        ctx.lineWidth = ln.base ? 1.5 : 1;
        ctx.strokeStyle = ln.base ? color('--guide-base') : color('--guide');
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        ctx.fillStyle = ln.base ? color('--guide-base') : color('--text-helper');
        ctx.fillText(ln.label, w - 8, y - 3);
      }
      ctx.setLineDash([]);
    }

    ctx.font = fontAt(fs);
    ctx.fillStyle = color('--glyph');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, w / 2, base);
  }
  const redrawAll = () => $$('canvas[data-glyph]').forEach(drawGlyph);

  // ---------- Router ----------
  const ROUTES = {
    learn: renderLearn,
    'quiz-cyr': () => startQuiz('cyr'),
    'quiz-lat': () => startQuiz('lat'),
    stats: renderStats,
    settings: renderSettings,
  };
  let current = 'learn';
  function route() {
    const r = location.hash.replace(/^#\/?/, '');
    current = ROUTES[r] ? r : 'learn';
    quiz = null;
    clearTimeout(autoTimer);
    clearTimeout(learn.timer);
    closeModal();
    $$('.shell__link').forEach(a => {
      const on = a.dataset.route === current;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    ROUTES[current]();
    window.scrollTo(0, 0);
  }

  function emptyPool(title) {
    main.innerHTML = `
      <div class="page-head"><h1>${title}</h1></div>
      <div class="empty">
        <h2>No letters selected</h2>
        <p>Choose which letters to practise in Settings.</p>
        <a class="btn btn--primary" href="#/settings">Open settings ${I.right}</a>
      </div>`;
  }

  // ---------- Learn mode ----------
  const learn = { order: [], i: 0, key: '', timer: 0, hidden: false };

  function renderLearn() {
    const p = pool();
    if (!p.length) return emptyPool('Learn');
    const key = settings.selected.join() + settings.learnShuffle;
    if (key !== learn.key) {
      learn.key = key;
      learn.order = p.map(l => l.id);
      if (settings.learnShuffle) shuffle(learn.order);
      learn.i = 0;
    }
    drawLearn();
  }

  function drawLearn() {
    const l = BY_ID[learn.order[learn.i]];
    const n = learn.order.length;
    const latPair = capFirst(l.lat) === l.lat ? l.lat : `${capFirst(l.lat)} ${l.lat}`;
    const delay = settings.revealDelay;
    clearTimeout(learn.timer);
    learn.hidden = delay > 0;
    main.innerHTML = `
      <div class="page-head">
        <h1>Learn</h1>
        <p>Each Cyrillic letter next to its Latin equivalent, uppercase and lowercase. Only letters selected in Settings are shown.</p>
      </div>
      <div class="learn__bar">
        <span class="counter">${String(learn.i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span>
        ${langTags(l)}
      </div>
      <div class="learn__pair">
        <div class="stage">
          <div class="stage__corner"><span class="stage__label">Cyrillic</span>${soundBtn(l, 'icon-btn--sm stage__sound')}</div>
          <canvas data-glyph="${l.up} ${l.lo}" role="img" aria-label="Cyrillic ${l.up} ${l.lo}"></canvas>
        </div>
        <div class="learn__arrow">${I.right}</div>
        <div class="stage stage--reveal ${learn.hidden ? 'is-hidden' : ''}" data-reveal>
          <div class="stage__corner"><span class="stage__label">Latin (Czech)</span></div>
          <canvas data-glyph="${latPair}" data-font="lat" ${HINTS[l.lat] ? `data-caption="1"` : ''} role="img" aria-label="Latin ${latPair}"></canvas>
          ${HINTS[l.lat] ? `<div class="stage__caption">${HINTS[l.lat]}</div>` : ''}
          ${learn.hidden ? `
            <div class="reveal">
              <div class="reveal__track"><div class="reveal__bar" style="animation-duration:${delay}s"></div></div>
              <button class="btn btn--ghost btn--sm" data-act="reveal">Show now <kbd>Space</kbd></button>
            </div>` : ''}
        </div>
      </div>
      ${l.note ? `<p class="learn__note" data-note ${learn.hidden ? 'hidden' : ''}>${l.note}</p>` : ''}
      <div class="learn__controls">
        <div class="btn-row">
          <button class="btn btn--secondary" data-act="prev">Previous ${I.left}</button>
          <button class="btn btn--primary" data-act="next">Next ${I.right}</button>
        </div>
        <label class="toggle">
          <input type="checkbox" data-act="shuffle" ${settings.learnShuffle ? 'checked' : ''}>
          <span class="toggle__track"></span>
          <span class="toggle__text">Shuffle order</span>
        </label>
        <span class="spacer"></span>
        <span class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> to move${delay ? ', <kbd>Space</kbd> to reveal' : ''}${TTS ? ', <kbd>S</kbd> for sound' : ''}</span>
      </div>
      <div class="strip" aria-label="Jump to letter">
        ${learn.order.map((id, k) => `<button class="chip ${k === learn.i ? 'is-current' : ''}" data-jump="${k}" title="${BY_ID[id].langs.map(g => LANG_LABEL[g]).join('/')}" ${fontStyle(glyphFont())}>${BY_ID[id].up}</button>`).join('')}
      </div>`;

    if (learn.hidden) {
      $('[data-act=reveal]').onclick = revealLearn;
      learn.timer = setTimeout(revealLearn, delay * 1000);
    } else if (settings.soundLearn) speak(l);
    $('[data-act=prev]').onclick = () => stepLearn(-1);
    $('[data-act=next]').onclick = () => stepLearn(1);
    $('[data-act=shuffle]').onchange = e => { settings.learnShuffle = e.target.checked; saveSettings(); renderLearn(); };
    $$('[data-jump]').forEach(b => (b.onclick = () => { learn.i = +b.dataset.jump; drawLearn(); }));
    redrawAll();
  }

  function revealLearn() {
    clearTimeout(learn.timer);
    if (!learn.hidden) return;
    learn.hidden = false;
    const stage = $('[data-reveal]');
    if (!stage) return;
    stage.classList.remove('is-hidden');
    const r = $('.reveal', stage);
    if (r) r.remove();
    const note = $('[data-note]');
    if (note) note.hidden = false;
    if (settings.soundLearn) speak(BY_ID[learn.order[learn.i]]);
  }

  function stepLearn(d) {
    const n = learn.order.length;
    learn.i = (learn.i + d + n) % n;
    if (d > 0 && learn.i === 0 && settings.learnShuffle) shuffle(learn.order);
    drawLearn();
    $(d > 0 ? '[data-act=next]' : '[data-act=prev]').focus();
  }

  // ---------- Quiz ----------
  let quiz = null;
  let autoTimer = 0;

  function buildQuestions(mode, n, p) {
    const qs = [];
    let bag = [];
    while (qs.length < n) {
      if (!bag.length) bag = shuffle(p.slice());
      let l = bag.pop();
      const prev = qs[qs.length - 1];
      if (prev && prev.l.id === l.id && bag.length) { const other = bag.pop(); bag.push(l); l = other; }
      const up = settings.letterCase === 'upper' || (settings.letterCase === 'mixed' && Math.random() < 0.5);
      qs.push(makeQuestion(mode, l, up, p));
    }
    return qs;
  }

  function makeQuestion(mode, l, up, p) {
    // Anything that is a valid reading in either language is never offered as a wrong answer
    // (e.g. Г is g in Russian and h in Ukrainian).
    const keyOf = mode === 'cyr' ? x => x.lat : x => x.up;
    const valid = new Set(mode === 'cyr'
      ? LETTERS.filter(x => x.up === l.up).map(x => x.lat)
      : LETTERS.filter(x => x.lat === l.lat).map(x => x.up));
    const pickFrom = src => shuffle(Array.from(new Set(src.map(keyOf))).filter(k => !valid.has(k)));
    const need = settings.optionCount - 1;
    let wrong = pickFrom(p).slice(0, need);
    if (wrong.length < need) {
      const extra = pickFrom(LETTERS).filter(k => !wrong.includes(k));
      wrong = wrong.concat(extra.slice(0, need - wrong.length));
    }
    const label = k => {
      if (mode === 'cyr') return up ? capFirst(k) : k;
      const x = LETTERS.find(y => y.up === k);
      return up ? x.up : x.lo;
    };
    const options = shuffle([keyOf(l), ...wrong]).map(k => ({
      key: k, label: label(k), hint: mode === 'cyr' ? HINTS[k] || '' : '',
    }));
    return { l, up, options, answer: keyOf(l), prompt: mode === 'cyr' ? cyrOf(l, up) : latOf(l, up) };
  }

  function startQuiz(mode) {
    const p = pool();
    if (!p.length) return emptyPool(MODES[mode].title);
    quiz = {
      mode, i: 0, correct: 0, wrong: 0, misses: {}, mistakes: [], start: Date.now(),
      qs: buildQuestions(mode, settings.count, p),
    };
    drawQuestion();
  }

  function drawQuestion() {
    const q = quiz.qs[quiz.i];
    const n = quiz.qs.length;
    const mode = MODES[quiz.mode];
    const hint = quiz.mode === 'lat' ? HINTS[q.l.lat] : '';
    const optFont = quiz.mode === 'lat' ? fontStyle(glyphFont()) : '';
    const nOpt = q.options.length;
    const keyLabel = k => (k === 9 ? 0 : k + 1);
    main.innerHTML = `
      <div class="quiz">
        <div class="quiz__top">
          <h1>${mode.title}</h1>
          <div class="score" aria-live="polite">
            <div class="score__item score__item--ok"><span>Correct</span><b data-score="ok">${quiz.correct}</b></div>
            <div class="score__item score__item--bad"><span>Incorrect</span><b data-score="bad">${quiz.wrong}</b></div>
          </div>
        </div>
        <div class="progress">
          <div class="progress__head"><span>Question ${quiz.i + 1} of ${n}</span><span>${Math.round(quiz.i / n * 100)}%</span></div>
          <div class="progress__track"><div class="progress__bar" style="width:${quiz.i / n * 100}%"></div></div>
        </div>
        <div class="stage stage--quiz">
          <div class="stage__corner">${langTags(q.l)}<span class="tag">${q.up ? 'Uppercase' : 'Lowercase'}</span></div>
          <canvas data-glyph="${q.prompt}" ${quiz.mode === 'lat' ? 'data-font="lat"' : ''} ${hint ? 'data-caption="1"' : ''} role="img" aria-label="${q.prompt}"></canvas>
          ${hint ? `<div class="stage__caption">${hint}</div>` : ''}
        </div>
        <p class="quiz__prompt">${mode.prompt}</p>
        <div class="options options--${nOpt}">
          ${q.options.map((o, k) => `
            <button class="option" data-k="${k}">
              <span class="option__key">${keyLabel(k)}</span>
              <span class="option__text" ${optFont}>${o.label}</span>
              ${o.hint ? `<span class="option__hint">${o.hint}</span>` : ''}
              <span class="option__icon"></span>
            </button>`).join('')}
        </div>
        <div class="feedback" aria-live="polite"></div>
        <div class="quiz__actions">
          <button class="btn btn--ghost" data-act="restart">Restart test ${I.restart}</button>
          <span class="kbd-hint"><kbd>1</kbd>–<kbd>${keyLabel(nOpt - 1)}</kbd> to answer, <kbd>Enter</kbd> to continue</span>
          <button class="btn btn--primary" data-act="next" hidden>${quiz.i + 1 === n ? 'See results' : 'Next question'} ${I.right}</button>
        </div>
      </div>`;
    $$('.option').forEach(b => (b.onclick = () => answer(+b.dataset.k)));
    $('[data-act=restart]').onclick = () => startQuiz(quiz.mode);
    $('[data-act=next]').onclick = nextQuestion;
    redrawAll();
  }

  function answer(k) {
    const q = quiz.qs[quiz.i];
    if (q.done) return;
    q.done = true;
    const ok = q.options[k].key === q.answer;
    if (ok) quiz.correct++;
    else {
      quiz.wrong++;
      quiz.misses[q.l.id] = (quiz.misses[q.l.id] || 0) + 1;
      quiz.mistakes.push(q.l.id);
    }

    $$('.option').forEach((b, j) => {
      b.disabled = true;
      const isAns = q.options[j].key === q.answer;
      if (isAns) { b.classList.add('is-correct'); $('.option__icon', b).innerHTML = I.checkFilled; }
      else if (j === k) { b.classList.add('is-wrong'); $('.option__icon', b).innerHTML = I.errorFilled; }
      else b.classList.add('is-dim');
    });
    $('[data-score=ok]').textContent = quiz.correct;
    $('[data-score=bad]').textContent = quiz.wrong;

    const pair = `<b ${fontStyle(glyphFont())}>${cyrOf(q.l, q.up)}</b> = <b>${latOf(q.l, q.up)}</b>`;
    $('.feedback').innerHTML = (ok
      ? `<span class="feedback__msg feedback__msg--ok">${I.checkFilled} Correct — ${pair}</span>`
      : `<span class="feedback__msg feedback__msg--bad">${I.errorFilled} Not quite — ${pair}${q.l.note ? `. ${q.l.note}` : ''}</span>`)
      + soundBtn(q.l);
    if (settings.soundQuiz) speak(q.l);

    const next = $('[data-act=next]');
    next.hidden = false;
    next.focus();
    if (ok && settings.autoNext) autoTimer = setTimeout(nextQuestion, 800);
  }

  function nextQuestion() {
    clearTimeout(autoTimer);
    if (!quiz || !quiz.qs[quiz.i].done) return;
    quiz.i++;
    if (quiz.i >= quiz.qs.length) finishQuiz();
    else drawQuestion();
  }

  function finishQuiz() {
    const dur = Math.round((Date.now() - quiz.start) / 1000);
    const total = quiz.qs.length;
    const pct = Math.round(quiz.correct / total * 100);
    const seen = {};
    quiz.qs.forEach(q => (seen[q.l.id] = (seen[q.l.id] || 0) + 1));
    history.push({ ts: Date.now(), mode: quiz.mode, total, correct: quiz.correct, wrong: quiz.wrong, dur, misses: quiz.misses, seen });
    if (history.length > 1000) history = history.slice(-1000);
    save('history', history);

    const counts = {};
    quiz.mistakes.forEach(id => (counts[id] = (counts[id] || 0) + 1));
    const missed = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const mode = quiz.mode;

    main.innerHTML = `
      <div class="quiz">
        <div class="page-head"><h1>Test complete</h1><p>${MODES[mode].title}</p></div>
        <div class="result">
          <div>
            <span class="label">Accuracy</span>
            <div class="result__pct" style="color:${pctColor(pct)}">${pct}%</div>
          </div>
          <div class="result__facts">
            <div><span class="label">Questions</span><b>${total}</b></div>
            <div><span class="label">Correct</span><b>${quiz.correct}</b></div>
            <div><span class="label">Incorrect</span><b>${quiz.wrong}</b></div>
            <div><span class="label">Time</span><b>${fmtDur(dur)}</b></div>
          </div>
        </div>
        ${missed.length ? `
          <h2 style="font-size:20px;line-height:28px;margin:32px 0 16px">Letters to review</h2>
          <div class="missed">${missed.map(([id, c]) => missedItem(BY_ID[id], c)).join('')}</div>`
        : `<div class="notice" style="border-left-color:var(--success);background:var(--success-bg)">${I.checkFilled.replace('<svg', '<svg style="fill:var(--success)"')} Perfect score — no mistakes.</div>`}
        <div class="btn-row btn-row--spaced" style="margin-top:32px">
          <button class="btn btn--primary" data-act="again">New test ${I.restart}</button>
          <a class="btn btn--tertiary" href="#/stats">View statistics ${I.right}</a>
        </div>
      </div>`;
    quiz = null;
    $('[data-act=again]').onclick = () => startQuiz(mode);
    $('[data-act=again]').focus();
  }

  const missedItem = (l, c) => `
    <div class="missed__item" title="${l.langs.map(g => LANG_LABEL[g]).join('/')}">
      <span class="missed__cyr">${l.up}${l.lo}</span>
      <span class="missed__lat">${l.lat}</span>
      <span class="missed__n">${c}×</span>
      ${soundBtn(l, 'icon-btn--sm')}
    </div>`;

  // ---------- Statistics ----------
  function renderStats() {
    const head = `<div class="page-head"><h1>Statistics</h1><p>Results of your finished tests. Abandoned tests are not recorded.</p></div>`;
    if (!history.length) {
      main.innerHTML = `${head}
        <div class="empty">
          <h2>No tests yet</h2>
          <p>Finish a test and its result will show up here.</p>
          <a class="btn btn--primary" href="#/quiz-cyr">Start a test ${I.right}</a>
        </div>`;
      return;
    }
    const totQ = history.reduce((s, h) => s + h.total, 0);
    const totC = history.reduce((s, h) => s + h.correct, 0);
    const best = Math.max(...history.map(h => Math.round(h.correct / h.total * 100)));
    const last10 = history.slice(-10);
    const recent = Math.round(last10.reduce((s, h) => s + h.correct, 0) / last10.reduce((s, h) => s + h.total, 0) * 100);


    const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    const rows = history.slice().reverse().map(h => {
      const p = Math.round(h.correct / h.total * 100);
      return `<tr>
        <td>${dateFmt.format(new Date(h.ts))}</td>
        <td>${MODES[h.mode] ? MODES[h.mode].title : h.mode}</td>
        <td class="num">${h.total}</td>
        <td class="num">${h.correct}</td>
        <td class="num">${h.wrong}</td>
        <td><div class="acc"><div class="acc__track"><div class="acc__bar" style="width:${p}%;background:${pctColor(p)}"></div></div><span class="acc__val">${p}%</span></div></td>
        <td class="num">${h.dur != null ? fmtDur(h.dur) : '–'}</td>
      </tr>`;
    }).join('');

    main.innerHTML = `${head}
      <div class="tiles">
        <div class="tile"><span>Tests taken</span><b>${history.length}</b></div>
        <div class="tile"><span>Questions answered</span><b>${totQ}</b></div>
        <div class="tile"><span>Overall accuracy</span><b>${Math.round(totC / totQ * 100)}%</b></div>
        <div class="tile"><span>Last ${last10.length} tests · best</span><b>${recent}% · ${best}%</b></div>
      </div>
      ${letterStats()}
      <div class="section">
        <h2>Past tests</h2>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Date</th><th>Mode</th><th class="num">Questions</th><th class="num">Correct</th><th class="num">Incorrect</th><th>Accuracy</th><th class="num">Time</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
      <div class="section">
        <button class="btn btn--danger-tertiary" data-act="clear">Clear statistics</button>
      </div>`;
    $('[data-act=clear]').onclick = confirmClear;
    bindLetterStats();
  }
  const bindLetterStats = () => $$('.switcher[data-stats]').forEach(sw => $$('.switcher__btn', sw).forEach(b => (b.onclick = () => {
    statsView[sw.dataset.stats] = b.dataset.value;
    $('[data-letter-stats]').outerHTML = letterStats();
    bindLetterStats();
  })));

  // Per-letter accuracy across all finished tests (only tests that recorded which letters were shown).
  const statsView = { mode: 'all', sort: 'alpha' };
  function letterStats() {
    const tracked = history.filter(h => h.seen && (statsView.mode === 'all' || h.mode === statsView.mode));
    const untracked = history.some(h => !h.seen);
    const agg = Object.fromEntries(LETTERS.map(l => [l.id, { shown: 0, missed: 0 }]));
    tracked.forEach(h => {
      Object.entries(h.seen).forEach(([id, c]) => { if (agg[id]) agg[id].shown += c; });
      Object.entries(h.misses || {}).forEach(([id, c]) => { if (agg[id]) agg[id].missed += c; });
    });
    const rows = LETTERS.map((l, i) => {
      const a = agg[l.id];
      return { l, i, shown: a.shown, correct: a.shown - a.missed, pct: a.shown ? Math.round((a.shown - a.missed) / a.shown * 100) : null };
    });
    if (statsView.sort === 'worst') rows.sort((a, b) => (a.pct ?? 101) - (b.pct ?? 101) || b.shown - a.shown);
    if (statsView.sort === 'shown') rows.sort((a, b) => b.shown - a.shown || a.i - b.i);

    const sw = (key, opts) => `
      <div class="switcher" role="radiogroup" data-stats="${key}">
        ${opts.map(([v, t]) => `<button class="switcher__btn ${statsView[key] === v ? 'is-selected' : ''}" role="radio" aria-checked="${statsView[key] === v}" data-value="${v}">${t}</button>`).join('')}
      </div>`;
    const glyph = fontStyle(glyphFont());
    return `
      <div class="section" data-letter-stats>
        <h2>Letters</h2>
        <div class="filters">
          <div><span class="label">Mode</span>${sw('mode', [['all', 'Both'], ['cyr', 'Cyrillic → Latin'], ['lat', 'Latin → Cyrillic']])}</div>
          <div><span class="label">Sort by</span>${sw('sort', [['alpha', 'Alphabet'], ['worst', 'Lowest accuracy'], ['shown', 'Most shown']])}</div>
        </div>
        ${untracked ? `<p class="helper" style="margin-bottom:12px">Some older tests were taken before per-letter tracking was added and are not included here.</p>` : ''}
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Letter</th><th>Latin</th><th>Language</th><th class="num">Shown</th><th class="num">Correct</th><th>Accuracy</th></tr></thead>
            <tbody>${rows.map(r => `
              <tr class="${r.shown ? '' : 'is-untested'}">
                <td><span class="letter-cell" ${glyph}>${r.l.up} ${r.l.lo}</span>${soundBtn(r.l, 'icon-btn--sm')}</td>
                <td>${r.l.lat}</td>
                <td>${langTags(r.l)}</td>
                <td class="num">${r.shown}</td>
                <td class="num">${r.shown ? r.correct : '–'}</td>
                <td>${r.pct == null ? '<span class="helper">Not tested yet</span>'
                  : `<div class="acc"><div class="acc__track"><div class="acc__bar" style="width:${r.pct}%;background:${pctColor(r.pct)}"></div></div><span class="acc__val">${r.pct}%</span></div>`}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function confirmClear() {
    openModal({
      label: 'Statistics',
      title: 'Clear all statistics?',
      body: `This permanently removes ${history.length} recorded test${history.length === 1 ? '' : 's'}. Your settings are kept.`,
      confirm: 'Clear statistics',
      onConfirm: () => { history = []; save('history', history); if (current === 'stats') renderStats(); },
    });
  }

  // ---------- Modal ----------
  let lastFocus = null;
  function openModal({ label, title, body, confirm, onConfirm }) {
    lastFocus = document.activeElement;
    $('#modal-root').innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__box">
          <div class="modal__body">
            <div class="modal__label">${label}</div>
            <h2 id="modal-title">${title}</h2>
            <p>${body}</p>
          </div>
          <div class="modal__foot">
            <button class="btn btn--secondary" data-act="cancel">Cancel</button>
            <button class="btn btn--danger" data-act="confirm">${confirm}</button>
          </div>
        </div>
      </div>`;
    const m = $('.modal');
    m.onclick = e => { if (e.target === m) closeModal(); };
    $('[data-act=cancel]', m).onclick = closeModal;
    $('[data-act=confirm]', m).onclick = () => { onConfirm(); closeModal(); };
    $('[data-act=cancel]', m).focus();
  }
  function closeModal() {
    const root = $('#modal-root');
    if (!root.innerHTML) return;
    root.innerHTML = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  // ---------- Settings ----------
  const switcher = (key, opts) => `
    <div class="switcher" role="radiogroup" data-setting="${key}">
      ${opts.map(([v, t]) => `<button class="switcher__btn ${settings[key] === v ? 'is-selected' : ''}" role="radio" aria-checked="${settings[key] === v}" data-value="${v}">${t}</button>`).join('')}
    </div>`;
  const toggle = (key, text) => `
    <label class="toggle">
      <input type="checkbox" data-toggle="${key}" ${settings[key] ? 'checked' : ''}>
      <span class="toggle__track"></span>
      <span class="toggle__text">${text}</span>
    </label>`;

  function renderSettings() {
    const groups = [
      ['Shared by Russian and Ukrainian', LETTERS.filter(l => l.langs.length === 2)],
      ['Russian only', LETTERS.filter(l => l.langs.length === 1 && l.langs[0] === 'ru')],
      ['Ukrainian only', LETTERS.filter(l => l.langs.length === 1 && l.langs[0] === 'uk')],
    ];
    main.innerHTML = `
      <div class="page-head"><h1>Settings</h1><p>Changes are saved automatically in this browser.</p></div>

      <section class="section" style="margin-top:0">
        <h2>Test</h2>
        <div class="form-row">
          <div class="field">
            <label class="label" for="count">Questions per test</label>
            <div class="number">
              <input id="count" type="number" min="1" max="200" step="1" value="${settings.count}" inputmode="numeric">
              <button type="button" data-step="-1" aria-label="Decrease">${I.sub}</button>
              <button type="button" data-step="1" aria-label="Increase">${I.add}</button>
            </div>
            <div class="presets">${[10, 20, 30, 50].map(v => `<button class="btn btn--ghost btn--sm" data-preset="${v}">${v}</button>`).join('')}</div>
            <p class="helper">Between 1 and 200. Letters repeat if there are more questions than selected letters.</p>
          </div>
          <div class="field">
            <span class="label">Answer options per question</span>
            ${switcher('optionCount', OPTION_COUNTS.map(n => [n, String(n)]))}
            <span class="label" style="margin-top:24px">Letter case in tests</span>
            ${switcher('letterCase', [['upper', 'Uppercase'], ['lower', 'Lowercase'], ['mixed', 'Mixed']])}
            <div style="margin-top:24px">${toggle('autoNext', 'Continue automatically after a correct answer')}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Learn</h2>
        <div class="field">
          <span class="label">Show the Latin equivalent after</span>
          ${switcher('revealDelay', REVEAL_DELAYS.map(s => [s, s ? `${s} s` : 'Off']))}
          <p class="helper">Gives you time to recall the letter before the answer appears. Off shows it immediately.</p>
        </div>
      </section>

      <section class="section">
        <div class="letters__head">
          <div>
            <h2 style="font-size:20px;line-height:28px">Letters</h2>
            <p class="helper" data-count></p>
          </div>
          <div class="btn-row">
            <button class="btn btn--tertiary btn--sm" data-sel="all">All</button>
            <button class="btn btn--tertiary btn--sm" data-sel="ru">Russian alphabet</button>
            <button class="btn btn--tertiary btn--sm" data-sel="uk">Ukrainian alphabet</button>
            <button class="btn btn--tertiary btn--sm" data-sel="none">None</button>
          </div>
        </div>
        <div data-notice></div>
        ${groups.map(([title, ls]) => `
          <div class="group">
            <div class="group__head"><h3>${title}</h3><button class="btn btn--ghost btn--sm" data-group="${ls.map(l => l.id).join(',')}">Toggle group</button></div>
            <div class="ltiles">
              ${ls.map(l => `
                <button class="ltile" data-id="${l.id}" aria-pressed="false">
                  <span class="check">${I.check}</span>
                  <span class="ltile__cyr">${l.up} ${l.lo}</span>
                  <span class="ltile__lat">${l.lat}${HINTS[l.lat] ? ` · ${HINTS[l.lat]}` : ''}</span>
                  ${langTags(l)}
                </button>`).join('')}
            </div>
          </div>`).join('')}
      </section>

      ${TTS ? `
      <section class="section">
        <h2>Sound</h2>
        <div class="form-row">
          <div class="field">
            <span class="label">Pronounce letters shared by both languages in</span>
            ${switcher('sharedVoice', [['ru', 'Russian'], ['uk', 'Ukrainian']])}
            <div style="margin-top:24px">${toggle('soundLearn', 'Play sound automatically in Learn')}</div>
            <div style="margin-top:16px">${toggle('soundQuiz', 'Play sound automatically after answering in tests')}</div>
          </div>
          <div class="field">
            <span class="label">Voices found in this browser</span>
            <div data-voices>${voiceStatus()}</div>
          </div>
        </div>
      </section>` : ''}

      <section class="section">
        <h2>Display</h2>
        <span class="label">Cyrillic letter style</span>
        <div class="fontpick" role="radiogroup" aria-label="Cyrillic letter style">
          ${Object.entries(FONTS).map(([k, f]) => `
            <button class="fontpick__item ${settings.font === k ? 'is-selected' : ''}" role="radio" aria-checked="${settings.font === k}" data-font-key="${k}">
              <span class="check">${I.check}</span>
              <span class="fontpick__sample" ${fontStyle(f)}>Аа Бб Дд Тт<br>Привіт, світ</span>
              <span class="fontpick__name">${f.label}</span>
              <span class="helper">${f.note}</span>
            </button>`).join('')}
        </div>
        <p class="helper">Handwritten styles follow Russian/Ukrainian cursive, where several lowercase letters look very different from print (т looks like m, д like g, и like u). Latin equivalents always stay in print.</p>
        <div class="form-row" style="margin-top:24px">
          <div class="field">${toggle('guides', 'Show baseline and guide lines')}</div>
          <div class="field">
            <span class="label">Theme</span>
            ${switcher('theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']])}
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Data</h2>
        <button class="btn btn--danger-tertiary" data-act="clear" ${history.length ? '' : 'disabled'}>Clear statistics</button>
        <p class="helper">${history.length} recorded test${history.length === 1 ? '' : 's'}.</p>
      </section>`;

    const count = $('#count');
    const setCount = v => {
      v = Math.max(1, Math.min(200, Math.round(+v) || DEFAULTS.count));
      settings.count = v; count.value = v; saveSettings();
    };
    count.onchange = () => setCount(count.value);
    $$('[data-step]').forEach(b => (b.onclick = () => setCount(settings.count + +b.dataset.step)));
    $$('[data-preset]').forEach(b => (b.onclick = () => setCount(+b.dataset.preset)));

    $$('.switcher').forEach(sw => $$('.switcher__btn', sw).forEach(b => (b.onclick = () => {
      const key = sw.dataset.setting;
      settings[key] = typeof DEFAULTS[key] === 'number' ? +b.dataset.value : b.dataset.value;
      saveSettings(); applyTheme(); refreshSoundButtons();
      $$('.switcher__btn', sw).forEach(x => { const on = x === b; x.classList.toggle('is-selected', on); x.setAttribute('aria-checked', on); });
    })));
    $$('[data-font-key]').forEach(b => (b.onclick = () => {
      settings.font = b.dataset.fontKey;
      saveSettings();
      $$('[data-font-key]').forEach(x => { const on = x === b; x.classList.toggle('is-selected', on); x.setAttribute('aria-checked', on); });
    }));
    $$('[data-toggle]').forEach(t => (t.onchange = () => { settings[t.dataset.toggle] = t.checked; saveSettings(); }));

    const setSelected = ids => {
      const set = new Set(ids);
      settings.selected = LETTERS.filter(l => set.has(l.id)).map(l => l.id);
      saveSettings(); syncLetters();
    };
    $$('.ltile').forEach(b => (b.onclick = () => {
      const id = b.dataset.id;
      setSelected(settings.selected.includes(id) ? settings.selected.filter(x => x !== id) : settings.selected.concat(id));
    }));
    $$('[data-sel]').forEach(b => (b.onclick = () => {
      const s = b.dataset.sel;
      setSelected(s === 'all' ? LETTERS.map(l => l.id) : s === 'none' ? [] : LETTERS.filter(l => l.langs.includes(s)).map(l => l.id));
    }));
    $$('[data-group]').forEach(b => (b.onclick = () => {
      const ids = b.dataset.group.split(',');
      const allOn = ids.every(id => settings.selected.includes(id));
      setSelected(allOn ? settings.selected.filter(id => !ids.includes(id)) : settings.selected.concat(ids));
    }));
    $('[data-act=clear]').onclick = () => openModal({
      label: 'Statistics', title: 'Clear all statistics?',
      body: `This permanently removes ${history.length} recorded test${history.length === 1 ? '' : 's'}. Your settings are kept.`,
      confirm: 'Clear statistics',
      onConfirm: () => { history = []; save('history', history); renderSettings(); },
    });
    syncLetters();
  }

  function voiceStatus() {
    const row = (lang, name, sample) => {
      const v = voiceFor(lang);
      return `<div class="voice">
        <span class="tag tag--${lang}">${LANG_LABEL[lang]}</span>
        <span class="voice__name">${v ? v.name : `<span class="helper">No ${name} voice installed</span>`}</span>
        ${v ? soundBtn(BY_ID[sample], 'icon-btn--sm') : ''}
      </div>`;
    };
    return `${row('ru', 'Russian', 'zh')}${row('uk', 'Ukrainian', 'h-uk')}
      <p class="helper">Sounds use your system's text-to-speech voices; each letter is spoken by its name (e.g. Б as "бэ"). Without a Ukrainian voice, Ukrainian-only letters fall back to the Russian voice where it sounds close enough (Ukrainian Г has no Russian equivalent). On Windows, add voices in Settings → Time &amp; language → Speech; Microsoft Edge also offers online voices for both languages.</p>`;
  }

  function syncLetters() {
    $$('.ltile').forEach(b => {
      const on = settings.selected.includes(b.dataset.id);
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-pressed', on);
    });
    const n = settings.selected.length;
    $('[data-count]').textContent = `${n} of ${LETTERS.length} selected`;
    $('[data-notice]').innerHTML = n === 0
      ? `<div class="notice notice--error">${I.errorFilled}<span><b>No letters selected.</b> Pick at least one letter to use Learn and the tests.</span></div>`
      : n < 4
        ? `<div class="notice">${I.warning}<span><b>Fewer than 4 letters selected.</b> Wrong answer options will be taken from the rest of the alphabet.</span></div>`
        : '';
  }

  // ---------- Keyboard ----------
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if ($('#modal-root').innerHTML) { if (e.key === 'Escape') closeModal(); return; }
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (current === 'learn' && learn.order.length && $('.learn__pair')) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stepLearn(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepLearn(-1); }
      if (e.key === ' ' && learn.hidden) { e.preventDefault(); revealLearn(); }
      if (e.key.toLowerCase() === 's') { e.preventDefault(); speak(BY_ID[learn.order[learn.i]]); }
    }
    if (quiz && quiz.qs[quiz.i]) {
      const q = quiz.qs[quiz.i];
      if (q.done && e.key.toLowerCase() === 's') { e.preventDefault(); speak(q.l); return; }
      const idx = /^[0-9]$/.test(e.key) ? (e.key === '0' ? 9 : +e.key - 1) : -1;
      if (!q.done && idx >= 0 && idx < q.options.length) { e.preventDefault(); answer(idx); }
      else if (q.done && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); nextQuestion(); }
    }
  });

  // ---------- Boot ----------
  applyTheme();
  if (TTS) {
    loadVoices();
    TTS.addEventListener('voiceschanged', () => {
      loadVoices();
      refreshSoundButtons();
      const vs = $('[data-voices]');
      if (vs) vs.innerHTML = voiceStatus();
    });
  }
  window.addEventListener('hashchange', route);
  let resizeRaf = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(redrawAll); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawAll);
  new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  route();
  // Redraw once the Cyrillic subsets of the web fonts have arrived so the guide lines match the real glyphs.
  if (document.fonts) {
    const sample = 'АаЖжЁёҐґЇїЄєHxp';
    Promise.all(Object.values(FONTS).map(f =>
      document.fonts.load(`${f.style} 400 100px ${f.family}`, sample).catch(() => {}),
    )).then(redrawAll);
    document.fonts.ready.then(redrawAll);
  }
})();
