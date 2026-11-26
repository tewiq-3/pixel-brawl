(() => {

  const $ = id => document.getElementById(id);

  const tg = window.Telegram?.WebApp;

if (tg) {

  tg.ready();

  tg.expand();

  if (typeof tg.disableVerticalSwipes === 'function') {

    tg.disableVerticalSwipes();

  }

}

  let activeSkin = localStorage.getItem('pb_skin') || 'classic';

  const data = {

    coins: Number(localStorage.getItem('pb_coins') || 0),

    wins: Number(localStorage.getItem('pb_wins') || 0),

    best: Number(localStorage.getItem('pb_best') || 0)

  };

  const save = () => {

    for (const k of Object.keys(data)) {

      localStorage.setItem('pb_' + k, data[k]);

    }

    updateStats();

  };

  function updateStats() {

    $('coins').textContent = data.coins;

    $('trophies').textContent = data.wins * 5;

    $('statWins').textContent = data.wins;

    $('statBest').textContent = data.best;

    $('statCoins').textContent = data.coins;

  }

  function showScreen(name) {

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    $(name).classList.add('active');

  }

  document.querySelectorAll('[data-screen]').forEach(b => {

    b.addEventListener('click', () => showScreen(b.dataset.screen));

  });

  $('playBtn').onclick = startGame;

  $('againBtn').onclick = startGame;

  $('homeBtn').onclick = () => {

    stopGame();

    showScreen('home');

  };

  $('quitBtn').onclick = () => {

    stopGame();

    showScreen('home');

  };

  $('pauseBtn').onclick = pauseGame;

  $('resumeBtn').onclick = resumeGame;

  function drawPortraits() {

    document.querySelectorAll('[data-byte-portrait]').forEach(canvas => {

      const variant = canvas.dataset.bytePortrait;

      const skin = (variant === 'home' || variant === 'profile') ? activeSkin : variant;

      const palettes = {

        classic: {

          shell: '#35b9c5', mid: '#168eaa', dark: '#12445c',

          light: '#8af4ee', eye: '#7dff75', signal: '#ffe078'

        },

        pink: {

          shell: '#ee86c5', mid: '#d953a5', dark: '#71305d',

          light: '#ffb7e1', eye: '#ffe36e', signal: '#ffe078'

        },

        neon: {

          shell: '#43d9ed', mid: '#168dbb', dark: '#193b70',

          light: '#a4fbff', eye: '#f58cff', signal: '#fff06a'

        },

        gold: {

          shell: '#f3c75b', mid: '#c58a2c', dark: '#705022',

          light: '#ffe6a0', eye: '#fff2a1', signal: '#fff3b0'

        }

      };

      const pal = palettes[skin] || palettes.classic;

      const c = canvas.getContext('2d');

      const w = canvas.width, h = canvas.height;

      c.clearRect(0, 0, w, h);

      c.save();

      c.scale(w / 180, h / 190);

      const { shell, mid, dark, light, eye } = pal;

      const visor = '#17264b';

      // Shadow and compact feet

      c.fillStyle = '#101827';

      c.fillRect(42, 166, 96, 9);

      c.fillRect(49, 157, 34, 13);

      c.fillRect(99, 157, 34, 13);

      c.fillStyle = dark;

      c.fillRect(45, 150, 38, 18);

      c.fillRect(97, 150, 38, 18);

      c.fillStyle = shell;

      c.fillRect(50, 151, 25, 8);

      c.fillRect(102, 151, 25, 8);

      c.fillStyle = light;

      c.fillRect(53, 151, 12, 3);

      c.fillRect(105, 151, 12, 3);

      // Side arms / gauntlets

      c.fillStyle = '#101827';

      c.fillRect(10, 83, 30, 61);

      c.fillRect(140, 83, 30, 61);

      c.fillStyle = dark;

      c.fillRect(13, 78, 32, 65);

      c.fillRect(135, 78, 32, 65);

      c.fillStyle = mid;

      c.fillRect(16, 82, 25, 55);

      c.fillRect(139, 82, 25, 55);

      c.fillStyle = shell;

      c.fillRect(19, 87, 17, 39);

      c.fillRect(144, 87, 17, 39);

      c.fillStyle = light;

      c.fillRect(21, 89, 5, 24);

      c.fillRect(147, 89, 5, 24);

      // Helmet shell

      c.fillStyle = '#101827';

      c.fillRect(48, 20, 84, 13);

      c.fillRect(34, 31, 112, 16);

      c.fillRect(26, 46, 128, 86);

      c.fillRect(36, 132, 108, 19);

      c.fillStyle = dark;

      c.fillRect(48, 17, 84, 13);

      c.fillRect(34, 28, 112, 16);

      c.fillRect(29, 43, 122, 87);

      c.fillRect(39, 128, 102, 17);

      c.fillStyle = shell;

      c.fillRect(50, 21, 80, 12);

      c.fillRect(39, 32, 102, 13);

      c.fillRect(34, 46, 112, 78);

      c.fillRect(44, 122, 92, 14);

      c.fillStyle = light;

      c.fillRect(49, 29, 32, 7);

      c.fillRect(112, 34, 17, 7);

      c.fillRect(37, 52, 7, 20);

      // Faceplate and eyes

      c.fillStyle = '#0c1734';

      c.fillRect(49, 52, 82, 70);

      c.fillRect(43, 61, 94, 51);

      c.fillStyle = visor;

      c.fillRect(52, 55, 76, 62);

      c.fillRect(47, 65, 86, 42);

      c.fillStyle = '#9abaff';

      c.fillRect(113, 59, 11, 4);

      c.fillRect(124, 63, 4, 13);

      c.fillStyle = eye;

      c.fillRect(66, 76, 10, 23);

      c.fillRect(103, 76, 10, 23);

      c.fillStyle = '#eaffc5';

      c.fillRect(66, 76, 4, 5);

      c.fillRect(103, 76, 4, 5);

      // Chest badge and details

      c.fillStyle = dark;

      c.fillRect(78, 126, 24, 12);

      c.fillStyle = light;

      c.fillRect(82, 128, 16, 5);

      c.fillStyle = '#f4d46a';

      c.fillRect(87, 129, 6, 4);

      c.fillStyle = '#101827';

      c.fillRect(48, 112, 6, 8);

      c.fillRect(126, 112, 6, 8);

      c.fillStyle = light;

      c.fillRect(49, 113, 4, 4);

      c.fillRect(127, 113, 4, 4);

      // Signal module

      c.fillStyle = dark;

      c.fillRect(82, 10, 16, 13);

      c.fillStyle = shell;

      c.fillRect(85, 5, 10, 12);

      c.fillStyle = pal.signal;

      c.fillRect(87, 3, 6, 6);

      c.restore();

    });

  }

  drawPortraits();

  function chooseSkin(name) {

    if (name === 'neon' || name === 'gold') {

      alert('Этот скин появится в одном из следующих обновлений.');

      return;

    }

    activeSkin = name;

    localStorage.setItem('pb_skin', name);

    drawPortraits();

    document.querySelectorAll('[data-skin]').forEach(b => {

      const card = b.closest('.skin-card');

      card.classList.toggle('selected', b.dataset.skin === name);

      b.textContent = b.dataset.skin === name ? 'Выбран' : 'Выбрать';

      b.classList.toggle('equipped', b.dataset.skin === name);

    });

  }

  document.querySelectorAll('[data-skin]').forEach(b => {

    b.onclick = () => chooseSkin(b.dataset.skin);

  });

  chooseSkin(activeSkin);

  updateStats();

  const canvas = $('arena');

  const ctx = canvas.getContext('2d');

  const W = canvas.width, H = canvas.height, tile = 50;

  let raf = 0, last = 0, running = false, paused = false;

  let player, enemies = [], bullets = [], enemyBullets = [], particles = [];

  let wave = 1, spawned = 0, defeated = 0, superCharge = 0;

  let attackHeld = false, joy = { x: 0, y: 0 };

  let walls = [];

  const mapLayouts = [

    [

      { x: 180, y: 120, w: 150, h: 45 },

      { x: 570, y: 120, w: 150, h: 45 },

      { x: 180, y: 430, w: 150, h: 45 },

      { x: 570, y: 430, w: 150, h: 45 },

      { x: 400, y: 245, w: 100, h: 110 },

      { x: 55, y: 260, w: 75, h: 70 },

      { x: 770, y: 260, w: 75, h: 70 }

    ],

    [

      { x: 115, y: 155, w: 90, h: 125 },

      { x: 695, y: 155, w: 90, h: 125 },

      { x: 115, y: 365, w: 90, h: 125 },

      { x: 695, y: 365, w: 90, h: 125 },

      { x: 350, y: 100, w: 200, h: 42 },

      { x: 350, y: 458, w: 200, h: 42 }

    ],

    [

      { x: 250, y: 95, w: 400, h: 38 },

      { x: 250, y: 467, w: 400, h: 38 },

      { x: 120, y: 220, w: 100, h: 160 },

      { x: 680, y: 220, w: 100, h: 160 }

    ],

    [

      { x: 90, y: 115, w: 160, h: 48 },

      { x: 650, y: 115, w: 160, h: 48 },

      { x: 90, y: 437, w: 160, h: 48 },

      { x: 650, y: 437, w: 160, h: 48 },

      { x: 385, y: 105, w: 130, h: 65 },

      { x: 385, y: 430, w: 130, h: 65 }

    ]

  ];

  const mapThemes = [

    { floor: '#477b50', a: '#548b58', b: '#4b8052', detail: '#3c7048' },

    { floor: '#596b8d', a: '#667ba0', b: '#536888', detail: '#435775' },

    { floor: '#8a704d', a: '#9c8059', b: '#876d4b', detail: '#6c563d' },

    { floor: '#397b78', a: '#458d89', b: '#367875', detail: '#285f60' }

  ];

  let mapIndex = 0, bossWave = 5, bossActive = false, bossBanner = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function rectHit(x, y, r, rect) {

    const px = clamp(x, rect.x, rect.x + rect.w);

    const py = clamp(y, rect.y, rect.y + rect.h);

    const dx = x - px, dy = y - py;

    return dx * dx + dy * dy < r * r;

  }

  function blocked(x, y, r) {

    return walls.some(w => rectHit(x, y, r, w));

  }

  function projectileHitsWall(x1, y1, x2, y2, r) {

    const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 4));

    for (let i = 1; i <= steps; i++) {

      const t = i / steps;

      if (blocked(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r)) {

        return true;

      }

    }

    return false;

  }

  function moveEntity(e, dx, dy) {

    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 4));

    const sx = dx / steps, sy = dy / steps;

    for (let i = 0; i < steps; i++) {

      const nx = clamp(e.x + sx, e.r, W - e.r);

      if (!blocked(nx, e.y, e.r)) e.x = nx;

      const ny = clamp(e.y + sy, e.r, H - e.r);

      if (!blocked(e.x, ny, e.r)) e.y = ny;

    }

  }

  function startGame() {

    showScreen('game');

    $('pauseOverlay').classList.add('hidden');

    $('endOverlay').classList.add('hidden');

    wave = 1;

    spawned = 0;

    defeated = 0;

    superCharge = 0;

    bossWave = 5 + Math.floor(Math.random() * 4);

    bossActive = false;

    bossBanner = 0;

    mapIndex = -1;

    updateSuperButton();

    bullets = [];

    enemyBullets = [];

    particles = [];

    player = {

      x: W / 2,

      y: 390,

      r: 17,

      hp: 100,

      maxHp: 100,

      speed: 220,

      cd: 0,

      faceX: 1,

      faceY: 0,

      inv: 0

    };

    enemies = [];

    spawnWave();

    running = true;

    paused = false;

    last = performance.now();

    cancelAnimationFrame(raf);

    raf = requestAnimationFrame(loop);

  }

  function stopGame() {

    running = false;

    cancelAnimationFrame(raf);

  }

  function pauseGame() {

    if (!running) return;

    paused = true;

    $('pauseOverlay').classList.remove('hidden');

  }

  function resumeGame() {

    paused = false;

    $('pauseOverlay').classList.add('hidden');

    last = performance.now();

    raf = requestAnimationFrame(loop);

  }

  function chooseMap() {

    mapIndex = (mapIndex + 1) % mapLayouts.length;

    walls = mapLayouts[mapIndex].map(w => ({ ...w }));

  }

  function spawnWave() {

    bullets = [];

    enemyBullets = [];

    chooseMap();

    bossActive = wave === bossWave;

    if (bossActive) {

      walls = [];

      enemies = [];

      spawned = 1;

      const hp = 680 + wave * 55;

      enemies.push({

        x: W / 2,

        y: 125,

        r: 35,

        hp,

        maxHp: hp,

        speed: 48 + Math.min(wave, 20),

        cd: 1.1,

        damage: 24,

        boss: true,

        flash: 0,

        colorIndex: 0

      });

      bossWave += 5 + Math.floor(Math.random() * 8);

    } else {

      const n = 3 + wave * 2;

      spawned = n;

      for (let i = 0; i < n; i++) {

        const side = i % 4;

        let x = side === 0 ? 35 : side === 1 ? W - 35 : Math.random() * (W - 100) + 50;

        let y = side === 2 ? 35 : side === 3 ? H - 35 : Math.random() * (H - 100) + 50;

        if (Math.hypot(x - W / 2, y - H / 2) < 150) {

          x = 40;

          y = 40;

        }

        if (blocked(x, y, 17)) {

          let found = false;

          for (let radius = 24; radius <= 260 && !found; radius += 12) {

            for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {

              const tx = clamp(x + Math.cos(a) * radius, 20, W - 20);

              const ty = clamp(y + Math.sin(a) * radius, 20, H - 20);

              if (!blocked(tx, ty, 17)) {

                x = tx;

                y = ty;

                found = true;

                break;

              }

            }

          }

        }

        enemies.push({

          x,

          y,

          r: 16,

          hp: 35 + wave * 8,

          maxHp: 35 + wave * 8,

          speed: 62 + Math.min(wave * 4, 45),

          cd: Math.random(),

          damage: 9,

          flash: 0,

          colorIndex: Math.floor(Math.random() * 6)

        });

      }

    }

    updateHud();

  }

  function updateHud() {

    $('hp').textContent = Math.max(0, Math.ceil(player?.hp || 0));

    $('wave').textContent = bossActive ? 'БОСС · ВОЛНА ' + wave : 'ВОЛНА ' + wave;

    $('enemyCount').textContent = bossActive

      ? 'БОСС: ' + (enemies[0] ? Math.max(0, Math.ceil(enemies[0].hp)) + '/' + enemies[0].maxHp : '0')

      : 'Враги: ' + enemies.length;

  }

  function shoot() {

    if (!running || paused || !player || player.cd > 0) return;

    const target = enemies.reduce(

      (best, e) => !best || dist(player, e) < dist(player, best) ? e : best,

      null

    );

    let dx = target ? target.x - player.x : player.faceX;

    let dy = target ? target.y - player.y : player.faceY;

    const d = Math.hypot(dx, dy) || 1;

    dx /= d;

    dy /= d;

    player.faceX = dx;

    player.faceY = dy;

    bullets.push({

      x: player.x + dx * 20,

      y: player.y + dy * 20,

      vx: dx * 460,

      vy: dy * 460,

      r: 7,

      life: 1.2,

      damage: 22

    });

    player.cd = .28;

  }

  function useSuper() {

    if (superCharge < 100 || !running || paused) return;

    superCharge = 0;

    updateSuperButton();

    for (const e of enemies) {

      const d = dist(player, e);

      if (d < 210) e.hp -= 90;

    }

    for (let i = 0; i < 36; i++) {

      const a = i * Math.PI * 2 / 36;

      particles.push({

        x: player.x,

        y: player.y,

        vx: Math.cos(a) * 210,

        vy: Math.sin(a) * 210,

        life: .65,

        color: '#d8a7ff'

      });

    }

  }

  function updateSuperButton() {

    const b = $('superBtn');

    if (!b) return;

    const pct = Math.floor(superCharge);

    b.classList.toggle('ready', superCharge >= 100);

    b.title = superCharge >= 100 ? 'Суператака готова!' : 'Заряд: ' + pct + '%';

    const fill = $('superFill');

    const label = $('superPercent');

    if (fill) fill.style.width = pct + '%';

    if (label) label.textContent = pct >= 100 ? 'ГОТОВО' : pct + '%';

  }

  $('attackBtn').addEventListener('pointerdown', e => {

    e.preventDefault();

    attackHeld = true;

    shoot();

  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {

    $('attackBtn').addEventListener(ev, () => attackHeld = false);

  });

  $('superBtn').addEventListener('pointerdown', e => {

    e.preventDefault();

    useSuper();

  });

  const joyEl = $('joystick');

  const stick = $('stick');

  let joyPointer = null;

  joyEl.addEventListener('pointerdown', e => {

    joyPointer = e.pointerId;

    joyEl.setPointerCapture(joyPointer);

    setJoy(e);

  });

  joyEl.addEventListener('pointermove', e => {

    if (e.pointerId === joyPointer) setJoy(e);

  });

  function setJoy(e) {

    const r = joyEl.getBoundingClientRect();

    const cx = r.left + r.width / 2;

    const cy = r.top + r.height / 2;

    let dx = e.clientX - cx;

    let dy = e.clientY - cy;

    const len = Math.hypot(dx, dy);

    const max = 35;

    if (len > max) {

      dx = dx / len * max;

      dy = dy / len * max;

    }

    joy.x = dx / max;

    joy.y = dy / max;

    stick.style.transform = `translate(${dx}px,${dy}px)`;

  }

  function resetJoy() {

    joyPointer = null;

    joy.x = joy.y = 0;

    stick.style.transform = 'translate(0,0)';

  }

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => {

    joyEl.addEventListener(ev, resetJoy);

  });

  const keys = {};

  window.addEventListener('keydown', e => {

    keys[e.key.toLowerCase()] = true;

    if (e.code === 'Space') {

      e.preventDefault();

      shoot();

    }

    if (e.key.toLowerCase() === 'q') useSuper();

  });

  window.addEventListener('keyup', e => {

    keys[e.key.toLowerCase()] = false;

  });

  function loop(t) {

    if (!running || paused) return;

    const dt = Math.min((t - last) / 1000, .035);

    last = t;

    // Пока Байт объясняет управление, бой стоит на месте.

    if ($('tutorialOverlay')?.classList.contains('hidden')) {

      update(dt);

    }

    draw();

    raf = requestAnimationFrame(loop);

  }

  function update(dt) {

    bossBanner = Math.max(0, bossBanner - dt);

    let ix = joy.x

      + (keys.d || keys.arrowright ? 1 : 0)

      - (keys.a || keys.arrowleft ? 1 : 0);

    let iy = joy.y

      + (keys.s || keys.arrowdown ? 1 : 0)

      - (keys.w || keys.arrowup ? 1 : 0);

    const l = Math.hypot(ix, iy);

    if (l > 1) {

      ix /= l;

      iy /= l;

    }

    if (l > .05) {

      moveEntity(player, ix * player.speed * dt, iy * player.speed * dt);

      player.faceX = ix;

      player.faceY = iy;

    }

    player.cd = Math.max(0, player.cd - dt);

    player.inv = Math.max(0, player.inv - dt);

    if (attackHeld && player.cd <= 0) shoot();

    for (const b of bullets) {

      const nx = b.x + b.vx * dt;

      const ny = b.y + b.vy * dt;

      b.life -= dt;

      if (projectileHitsWall(b.x, b.y, nx, ny, b.r)) {

        b.life = 0;

        continue;

      }

      b.x = nx;

      b.y = ny;

      for (const e of enemies) {

        if (e.hp > 0 && Math.hypot(b.x - e.x, b.y - e.y) < b.r + e.r) {

          e.hp -= b.damage;

          b.life = 0;

          superCharge = clamp(superCharge + 20, 0, 100);

          updateSuperButton();

          e.flash = .1;

          break;

        }

      }

    }

    bullets = bullets.filter(b =>

      b.life > 0 && b.x > 0 && b.x < W && b.y > 0 && b.y < H

    );

    for (const e of enemies) {

      const dx = player.x - e.x;

      const dy = player.y - e.y;

      const d = Math.hypot(dx, dy) || 1;

      if (d > 31) {

        const vx = dx / d;

        const vy = dy / d;

        moveEntity(e, vx * e.speed * dt, vy * e.speed * dt);

      } else if (e.cd <= 0) {

        player.hp -= e.damage || 9;

        player.inv = .22;

        e.cd = e.boss ? 1.05 : .75;

      }

      e.cd -= dt;

      e.flash = Math.max(0, e.flash - dt);

    }

    enemies = enemies.filter(e => {

      if (e.hp <= 0) {

        defeated++;

        data.coins += 3;

        for (let i = 0; i < 7; i++) {

          particles.push({

            x: e.x,

            y: e.y,

            vx: (Math.random() - .5) * 150,

            vy: (Math.random() - .5) * 150,

            life: .4,

            color: '#ffd34e'

          });

        }

        return false;

      }

      return true;

    });

    for (const p of particles) {

      p.x += p.vx * dt;

      p.y += p.vy * dt;

      p.life -= dt;

    }

    particles = particles.filter(p => p.life > 0);

    if (player.hp <= 0) {

      finish(false);

      return;

    }

    if (enemies.length === 0) {

      wave++;

      data.best = Math.max(data.best, wave - 1);

      player.hp = Math.min(100, player.hp + (bossActive ? 30 : 20));

      bossActive = false;

      spawnWave();

      save();

    }

    updateHud();

  }

  function finish(win) {

    stopGame();

    if (win) {

      data.wins++;

      data.coins += 20;

    }

    data.best = Math.max(data.best, wave - 1);

    save();

    $('endTitle').textContent = win

      ? 'АРЕНА ОЧИЩЕНА!'

      : 'БАЙТУ НУЖЕН РЕМОНТ';

    $('endText').textContent =

      `Ты прошёл волн: ${wave - 1}. Побеждено роботов: ${defeated}.`;

    $('endOverlay').classList.remove('hidden');

  }

  function draw() {

    ctx.clearRect(0, 0, W, H);

    const theme = mapThemes[Math.max(0, mapIndex) % mapThemes.length];

    ctx.fillStyle = theme.floor;

    ctx.fillRect(0, 0, W, H);

    for (let y = 0; y < H; y += 50) {

      for (let x = 0; x < W; x += 50) {

        ctx.fillStyle = ((x / 50 + y / 50) % 2 === 0) ? theme.a : theme.b;

        ctx.fillRect(x, y, 50, 50);

        ctx.fillStyle = theme.detail;

        ctx.fillRect(x + 7, y + 11, 3, 3);

        ctx.fillRect(x + 34, y + 31, 4, 3);

        ctx.fillStyle = '#ffffff12';

        ctx.fillRect(x + 2, y + 2, 46, 2);

      }

    }

    if (!bossActive) {

      for (let i = 0; i < 48; i++) {

        const x = (i * 137 + 23) % W;

        const y = (i * 83 + 19) % H;

        if (!walls.some(w =>

          x > w.x - 5 && x < w.x + w.w + 5 &&

          y > w.y - 5 && y < w.y + w.h + 5

        )) {

          ctx.fillStyle = i % 4 === 0 ? '#f6d66b' : '#2e6742';

          ctx.fillRect(x, y, 3, 5);

          ctx.fillRect(x + 4, y - 2, 3, 4);

        }

      }

    }

    if (!bossActive) {

      for (let i = 0; i < 12; i++) {

        const x = (i * 173 + 40) % W;

        const y = (i * 97 + 70) % H;

        if (!walls.some(w =>

          x > w.x - 20 && x < w.x + w.w + 20 &&

          y > w.y - 20 && y < w.y + w.h + 20

        )) {

          ctx.fillStyle = '#244f39';

          ctx.fillRect(x - 18, y - 10, 38, 27);

          ctx.fillStyle = '#2d7048';

          ctx.fillRect(x - 14, y - 17, 28, 28);

          ctx.fillStyle = '#46985a';

          ctx.fillRect(x - 9, y - 15, 12, 10);

          ctx.fillRect(x + 5, y - 7, 10, 9);

        }

      }

    }

    for (const w of walls) {

      ctx.fillStyle = '#263b50';

      ctx.fillRect(w.x + 3, w.y + 7, w.w, w.h);

      ctx.fillStyle = '#687f91';

      ctx.fillRect(w.x, w.y, w.w, w.h);

      ctx.fillStyle = '#91a8b7';

      ctx.fillRect(w.x, w.y, w.w, 7);

      ctx.fillStyle = '#536a7d';

      for (let xx = w.x + 12; xx < w.x + w.w - 8; xx += 38) {

        ctx.fillRect(xx, w.y + 10, 3, 13);

        ctx.fillRect(xx + 14, w.y + 28, 3, 12);

      }

      ctx.strokeStyle = '#34495d';

      ctx.lineWidth = 4;

      ctx.strokeRect(w.x + 2, w.y + 2, w.w - 4, w.h - 4);

    }

    // Projectiles

    for (const b of bullets) {

      ctx.globalAlpha = .35;

      ctx.fillStyle = '#ffe36b';

      ctx.fillRect(b.x - b.vx * .035, b.y - b.vy * .035, 12, 12);

      ctx.globalAlpha = 1;

      ctx.fillStyle = '#fff2a1';

      ctx.fillRect(b.x - 5, b.y - 5, 10, 10);

      ctx.fillStyle = '#ffae36';

      ctx.fillRect(b.x - 2, b.y - 2, 5, 5);

    }

    for (const e of enemies) {

      if (e.boss) {

        drawBoss(e.x, e.y, e.flash > 0);

        bar(e.x - 48, e.y - 58, 96, 9, e.hp / e.maxHp, '#ff4d68');

      } else {

        drawBot(e.x, e.y, 'enemy', e.flash > 0, e.colorIndex);

        bar(e.x - 18, e.y - 31, 36, 5, e.hp / e.maxHp, '#ff7777');

      }

    }

    if (bossBanner > 0) {

      ctx.save();

      ctx.globalAlpha = Math.min(1, bossBanner);

      ctx.fillStyle = '#160f28dd';

      ctx.fillRect(250, 235, 400, 90);

      ctx.strokeStyle = '#ff526d';

      ctx.lineWidth = 5;

      ctx.strokeRect(250, 235, 400, 90);

      ctx.fillStyle = '#fff';

      ctx.textAlign = 'center';

      ctx.font = 'bold 34px Nunito';

      ctx.fillText('⚠ БОСС ПРИБЫЛ!', 450, 292);

      ctx.restore();

    }

    drawBot(player.x, player.y, 'player', player.inv > 0);

    bar(player.x - 22, player.y - 34, 44, 6, player.hp / 100, '#65e58b');

    for (const p of particles) {

      ctx.globalAlpha = clamp(p.life / .5, 0, 1);

      ctx.fillStyle = p.color;

      ctx.fillRect(p.x, p.y, 6, 6);

    }

    ctx.globalAlpha = 1;

    ctx.fillStyle = '#fff';

    ctx.font = 'bold 15px Nunito';

    ctx.fillText('⚡ ' + Math.floor(superCharge) + '%', 14, 24);

  }

  function drawBoss(x, y, flash) {

    ctx.save();

    ctx.translate(Math.round(x), Math.round(y));

    ctx.fillStyle = '#25152c';

    ctx.fillRect(-39, 22, 78, 15);

    ctx.fillStyle = '#59243f';

    ctx.fillRect(-43, -28, 86, 58);

    ctx.fillStyle = flash ? '#fff' : '#b52f58';

    ctx.fillRect(-38, -34, 76, 58);

    ctx.fillStyle = '#ed5870';

    ctx.fillRect(-30, -40, 60, 13);

    ctx.fillRect(-48, -20, 12, 35);

    ctx.fillRect(36, -20, 12, 35);

    ctx.fillStyle = '#6e254e';

    ctx.fillRect(-25, 19, 18, 17);

    ctx.fillRect(7, 19, 18, 17);

    ctx.fillStyle = '#17223b';

    ctx.fillRect(-27, -17, 54, 27);

    ctx.fillStyle = '#fff078';

    ctx.fillRect(-19, -10, 10, 10);

    ctx.fillRect(9, -10, 10, 10);

    ctx.fillStyle = '#ff9b42';

    ctx.fillRect(-5, 6, 10, 6);

    ctx.fillStyle = '#f5c65e';

    ctx.fillRect(-8, -51, 16, 12);

    ctx.fillRect(-4, -59, 8, 9);

    ctx.restore();

  }

  function bar(x, y, w, h, pct, color) {

    ctx.fillStyle = '#172536';

    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#dce8ee';

    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    ctx.fillStyle = '#172536';

    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = color;

    ctx.fillRect(x + 1, y + 1, (w - 2) * clamp(pct, 0, 1), h - 2);

  }

  function drawBot(x, y, kind, flash, colorIndex = 0) {

    if (kind === 'player') {

      ctx.save();

      ctx.translate(Math.round(x), Math.round(y));

      ctx.scale(.32, .32);

      const pink = activeSkin === 'pink';

      const shell = pink ? '#ed83c4' : '#35b9c5';

      const mid = pink ? '#d953a5' : '#168eaa';

      const dark = pink ? '#71305d' : '#12445c';

      const light = pink ? '#ffb7e1' : '#8af4ee';

      const eye = pink ? '#ffe36e' : '#7dff75';

      // Feet and shadow

      ctx.fillStyle = '#10182799';

      ctx.fillRect(-105, 91, 210, 14);

      ctx.fillStyle = '#101820';

      ctx.fillRect(-78, 62, 55, 35);

      ctx.fillRect(23, 62, 55, 35);

      ctx.fillStyle = dark;

      ctx.fillRect(-76, 57, 50, 34);

      ctx.fillRect(26, 57, 50, 34);

      ctx.fillStyle = shell;

      ctx.fillRect(-69, 59, 36, 15);

      ctx.fillRect(33, 59, 36, 15);

      ctx.fillStyle = light;

      ctx.fillRect(-65, 60, 19, 5);

      ctx.fillRect(37, 60, 19, 5);

      // Side gauntlets

      ctx.fillStyle = '#101820';

      ctx.fillRect(-171, -24, 35, 82);

      ctx.fillRect(136, -24, 35, 82);

      ctx.fillStyle = dark;

      ctx.fillRect(-160, -38, 57, 100);

      ctx.fillRect(103, -38, 57, 100);

      ctx.fillStyle = mid;

      ctx.fillRect(-153, -31, 48, 84);

      ctx.fillRect(105, -31, 48, 84);

      ctx.fillStyle = shell;

      ctx.fillRect(-146, -24, 34, 65);

      ctx.fillRect(112, -24, 34, 65);

      ctx.fillStyle = light;

      ctx.fillRect(-140, -18, 8, 46);

      ctx.fillRect(132, -18, 8, 46);

      ctx.fillStyle = '#f5d46c';

      ctx.fillRect(-156, 37, 8, 8);

      ctx.fillRect(148, 37, 8, 8);

      // Helmet

      ctx.fillStyle = '#101820';

      ctx.fillRect(-91, -132, 182, 202);

      ctx.fillRect(-111, -108, 222, 154);

      ctx.fillRect(-94, 43, 188, 27);

      ctx.fillStyle = dark;

      ctx.fillRect(-87, -137, 174, 198);

      ctx.fillRect(-104, -108, 208, 151);

      ctx.fillRect(-83, 43, 166, 19);

      ctx.fillStyle = mid;

      ctx.fillRect(-79, -131, 158, 183);

      ctx.fillRect(-96, -104, 192, 138);

      ctx.fillRect(-72, 45, 144, 12);

      ctx.fillStyle = shell;

      ctx.fillRect(-72, -137, 144, 18);

      ctx.fillRect(-88, -119, 176, 18);

      ctx.fillRect(-91, -101, 182, 126);

      ctx.fillRect(-74, 25, 148, 22);

      ctx.fillStyle = light;

      ctx.fillRect(-63, -125, 48, 12);

      ctx.fillRect(45, -124, 27, 10);

      ctx.fillRect(-87, -93, 10, 25);

      ctx.fillRect(77, -92, 10, 24);

      // Visor and eyes

      ctx.fillStyle = '#0c1734';

      ctx.fillRect(-69, -88, 138, 108);

      ctx.fillRect(-81, -71, 162, 76);

      ctx.fillStyle = '#1e3262';

      ctx.fillRect(-65, -83, 130, 94);

      ctx.fillRect(-75, -66, 150, 63);

      ctx.fillStyle = '#a7c9ff';

      ctx.fillRect(40, -76, 23, 8);

      ctx.fillRect(63, -68, 7, 23);

      ctx.fillStyle = eye;

      ctx.fillRect(-35, -43, 20, 42);

      ctx.fillRect(28, -43, 20, 42);

      ctx.fillStyle = '#eaffc5';

      ctx.fillRect(-35, -43, 7, 9);

      ctx.fillRect(28, -43, 7, 9);

      // Chest and details

      ctx.fillStyle = dark;

      ctx.fillRect(-61, 17, 122, 14);

      ctx.fillStyle = shell;

      ctx.fillRect(-49, 23, 98, 10);

      ctx.fillStyle = '#101820';

      ctx.fillRect(-27, 28, 54, 13);

      ctx.fillStyle = light;

      ctx.fillRect(-20, 31, 8, 5);

      ctx.fillRect(-7, 31, 8, 5);

      ctx.fillRect(6, 31, 8, 5);

      ctx.fillStyle = '#f5d46c';

      ctx.fillRect(-10, 48, 20, 9);

      ctx.fillStyle = light;

      ctx.fillRect(-6, 49, 12, 5);

      ctx.fillStyle = dark;

      ctx.fillRect(-90, -34, 8, 35);

      ctx.fillRect(82, -34, 8, 35);

      // Signal fin

      ctx.fillStyle = dark;

      ctx.fillRect(-12, -151, 24, 18);

      ctx.fillStyle = shell;

      ctx.fillRect(-8, -158, 16, 12);

      ctx.fillStyle = '#f5d46c';

      ctx.fillRect(-4, -158, 8, 6);

      if (flash) {

        ctx.globalAlpha = .45;

        ctx.fillStyle = '#fff';

        ctx.fillRect(-100, -130, 200, 210);

        ctx.globalAlpha = 1;

      }

      ctx.restore();

      return;

    }

    ctx.save();

    ctx.translate(Math.round(x), Math.round(y));

    const palettes = [

      { shell: '#db5962', mid: '#a93650', dark: '#592d49', light: '#ff9a8e', glow: '#ffbd55' },

      { shell: '#4e9ee8', mid: '#2865b0', dark: '#203d70', light: '#9ed7ff', glow: '#e4f5ff' },

      { shell: '#55c98b', mid: '#26865e', dark: '#20543f', light: '#a2f3bd', glow: '#e5ff8a' },

      { shell: '#b17be8', mid: '#7546b4', dark: '#49336f', light: '#dfbaff', glow: '#fff0a0' },

      { shell: '#e4b84e', mid: '#aa762b', dark: '#654624', light: '#ffe49a', glow: '#fff5d0' },

      { shell: '#e88748', mid: '#b64e32', dark: '#71352e', light: '#ffc18d', glow: '#fff0a0' }

    ];

    const pal = palettes[((colorIndex % palettes.length) + palettes.length) % palettes.length];

    ctx.fillStyle = '#142b2a88';

    ctx.fillRect(-18, 15, 38, 8);

    ctx.fillStyle = pal.dark;

    ctx.fillRect(-2, -24, 5, 10);

    ctx.fillStyle = pal.light;

    ctx.fillRect(-5, -29, 11, 7);

    ctx.fillStyle = pal.glow;

    ctx.fillRect(-2, -31, 5, 4);

    ctx.fillStyle = pal.dark;

    ctx.fillRect(-19, -7, 7, 17);

    ctx.fillRect(12, -7, 7, 17);

    ctx.fillStyle = pal.mid;

    ctx.fillRect(-21, -5, 7, 10);

    ctx.fillRect(14, -5, 7, 10);

    ctx.fillStyle = '#182a3b';

    ctx.fillRect(-12, 11, 9, 8);

    ctx.fillRect(4, 11, 9, 8);

    ctx.fillStyle = pal.dark;

    ctx.fillRect(-13, 14, 11, 4);

    ctx.fillRect(3, 14, 11, 4);

    ctx.fillStyle = '#172a3b';

    ctx.fillRect(-15, -17, 30, 31);

    ctx.fillStyle = flash ? '#fff' : pal.shell;

    ctx.fillRect(-12, -17, 24, 26);

    ctx.fillStyle = pal.light;

    ctx.fillRect(-9, -15, 17, 4);

    ctx.fillRect(-12, -9, 3, 12);

    ctx.fillStyle = pal.mid;

    ctx.fillRect(-9, -8, 18, 12);

    ctx.fillStyle = '#ffe7a0';

    ctx.fillRect(-6, -6, 4, 5);

    ctx.fillRect(3, -6, 4, 5);

    ctx.fillStyle = pal.glow;

    ctx.fillRect(-5, -5, 2, 3);

    ctx.fillRect(4, -5, 2, 3);

    ctx.fillStyle = '#15283a';

    ctx.fillRect(-3, 2, 7, 2);

    ctx.restore();

  }


  // ==========================================
  // ЗНАКОМСТВО С БАЙТОМ И ОБУЧЕНИЕ
  // ==========================================

  function createGuideOverlay(id, content) {
    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'byte-guide-overlay hidden';
    overlay.innerHTML = `
      <div class="byte-guide-card">
        ${content}
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  const introOverlay = createGuideOverlay('introOverlay', `
    <div class="byte-guide-robot">🤖</div>
    <h2>Привет! Я Байт!</h2>
    <p>Добро пожаловать на арену PIXEL BRAWL! Я помогу тебе освоиться, расскажу об управлении и покажу, как побеждать противников.</p>
    <p>Готов начать знакомство?</p>
    <button id="introStartBtn" class="byte-guide-primary">Давай знакомиться!</button>
    <button id="introSkipBtn" class="byte-guide-secondary">Пропустить</button>
  `);

  const tutorialOverlay = createGuideOverlay('tutorialOverlay', `
    <img

  src="IMG_2897.jpeg"

  alt="Байт"

  class="byte-guide-robot"

  style="width:105px;height:105px;object-fit:contain;display:block;margin:0 auto 14px;"

>
    <div id="tutorialStepLabel" class="byte-guide-step"></div>
    <h2 id="tutorialTitle"></h2>
    <p id="tutorialText"></p>
    <button id="tutorialNextBtn" class="byte-guide-primary">Далее</button>
    <button id="tutorialSkipBtn" class="byte-guide-secondary">Пропустить обучение</button>
  `);

  const introStartBtn = $('introStartBtn');
  const introSkipBtn = $('introSkipBtn');
  const tutorialNextBtn = $('tutorialNextBtn');
  const tutorialSkipBtn = $('tutorialSkipBtn');

  const tutorialSteps = [
    {
      title: 'Движение',
      text: 'Управляй Байтом с помощью джойстика слева. Передвигайся по арене, обходи препятствия и держись подальше от противников.'
    },
    {
      title: 'Атака',
      text: 'Нажимай и удерживай кнопку «АТАКА» справа. Байт автоматически выбирает ближайшего противника и стреляет по нему.'
    },
    {
      title: 'Суператака',
      text: 'Попадания по врагам заряжают суперспособность. Когда шкала заполнится до 100%, нажми кнопку ⚡ «СУПЕР»!'
    },
    {
      title: 'Волны и боссы',
      text: 'Побеждай всех роботов, чтобы перейти к следующей волне. Иногда на арену приходит босс — у него гораздо больше здоровья!'
    },
    {
      title: 'Ты готов!',
      text: 'Вот и всё! Теперь ты знаешь основы PIXEL BRAWL. Удачи на арене! Если забудешь управление, я всегда подскажу.'
    }
  ];

  let tutorialStep = 0;

  function closeIntro() {
    introOverlay.classList.add('hidden');
    localStorage.setItem('pb_intro_seen', '1');
  }

  function updateTutorial() {
    const step = tutorialSteps[tutorialStep];
    if (!step) return;

    $('tutorialStepLabel').textContent =
      `ЗНАКОМСТВО ${tutorialStep + 1}/${tutorialSteps.length}`;

    $('tutorialTitle').textContent = step.title;
    $('tutorialText').textContent = step.text;

    tutorialNextBtn.textContent =
      tutorialStep === tutorialSteps.length - 1
        ? 'Завершить'
        : 'Далее';
  }

  function showTutorial() {
    tutorialStep = 0;
    showScreen('game');
    tutorialOverlay.classList.remove('hidden');
    updateTutorial();
  }

  function finishTutorial() {
    tutorialOverlay.classList.add('hidden');
    localStorage.setItem('pb_tutorial_seen', '1');
  }

  tutorialNextBtn.onclick = () => {
    tutorialStep++;

    if (tutorialStep >= tutorialSteps.length) {
      finishTutorial();
    } else {
      updateTutorial();
    }
  };

  tutorialSkipBtn.onclick = finishTutorial;

  introStartBtn.onclick = () => {

  closeIntro();

  startGame();

  showTutorial();

};

  introSkipBtn.onclick = closeIntro;

  // Приветствие при первом открытии игры.
  if (!localStorage.getItem('pb_intro_seen')) {
    introOverlay.classList.remove('hidden');
  }

  // Кнопка запуска игры.
  $('playBtn').onclick = () => {
    if (!localStorage.getItem('pb_intro_seen')) {
      introOverlay.classList.remove('hidden');
      return;
    }

    startGame();
  };

  // Добавляем кнопку повторного обучения в профиль.
  const replayTutorialBtn = document.createElement('button');

  replayTutorialBtn.id = 'replayTutorialBtn';
  replayTutorialBtn.className = 'guide-button';
  replayTutorialBtn.textContent = '🤖 Как играть?';

  const profileScreen = $('profile');
  const profileNote = profileScreen.querySelector('.small-note');

  if (profileNote) {
    profileNote.before(replayTutorialBtn);
  } else {
    profileScreen.appendChild(replayTutorialBtn);
  }

  replayTutorialBtn.onclick = () => {
    startGame();
    showTutorial();
  };

  // Отключаем случайное масштабирование страницы жестами.
  document.addEventListener('gesturestart', e => e.preventDefault());
introOverlay.style.pointerEvents = 'auto';

tutorialOverlay.style.pointerEvents = 'auto';

introStartBtn.style.pointerEvents = 'auto';

introSkipBtn.style.pointerEvents = 'auto';

console.log('Кнопки Байта подключены');

})();

  