const PLAYER_COLORS = [
  "#f97316",
  "#22c55e",
  "#38bdf8",
  "#a78bfa",
  "#f43f5e",
  "#eab308",
  "#14b8a6",
  "#fb7185",
  "#60a5fa",
  "#c084fc",
];

const CAR_DEFS = [
  {
    id: "santa-fe",
    name: "싼타페",
    label: "2026 싼타페",
    image: "./assets/cars/car-01.webp",
    flipInRace: true,
    color: "#e5e7eb",
    width: 1.04,
    height: 1.08,
    roofX: 0.38,
    roofWidth: 0.42,
    roofHeight: 0.5,
    wheelBase: 0.62,
    roundness: 0.16,
    stance: "tall",
  },
  {
    id: "grandeur",
    name: "그랜저",
    label: "2027 그랜저",
    image: "./assets/cars/car-02.webp",
    flipInRace: true,
    color: "#111827",
    width: 1.2,
    height: 0.9,
    roofX: 0.42,
    roofWidth: 0.38,
    roofHeight: 0.38,
    wheelBase: 0.69,
    roundness: 0.24,
    stance: "long",
  },
  {
    id: "casper",
    name: "캐스퍼",
    label: "2026 캐스퍼",
    image: "./assets/cars/car-03.webp",
    flipInRace: true,
    color: "#f8fafc",
    width: 0.95,
    height: 1.08,
    roofX: 0.34,
    roofWidth: 0.44,
    roofHeight: 0.5,
    wheelBase: 0.58,
    roundness: 0.22,
    stance: "tall",
  },
  {
    id: "sorento",
    name: "쏘렌토",
    label: "2026 쏘렌토",
    image: "./assets/cars/car-04.webp",
    flipInRace: false,
    color: "#f1f5f9",
    width: 1.08,
    height: 1.06,
    roofX: 0.38,
    roofWidth: 0.43,
    roofHeight: 0.48,
    wheelBase: 0.64,
    roundness: 0.17,
    stance: "tall",
  },
  {
    id: "mclaren-720s",
    name: "맥라렌 720S",
    label: "2026 맥라렌 720S",
    image: "./assets/cars/car-05.webp",
    flipInRace: true,
    color: "#f97316",
    width: 1.18,
    height: 0.62,
    roofX: 0.48,
    roofWidth: 0.28,
    roofHeight: 0.3,
    wheelBase: 0.7,
    roundness: 0.18,
    stance: "sharp",
  },
  {
    id: "morning",
    name: "모닝",
    label: "2025 모닝",
    image: "./assets/cars/car-06.webp",
    flipInRace: true,
    color: "#d1d5db",
    width: 0.84,
    height: 0.82,
    roofX: 0.34,
    roofWidth: 0.42,
    roofHeight: 0.45,
    wheelBase: 0.54,
    roundness: 0.32,
    stance: "round",
  },
  {
    id: "bmw-m3",
    name: "BMW M3",
    label: "2026 BMW M3",
    image: "./assets/cars/car-07.webp",
    flipInRace: true,
    color: "#22c55e",
    width: 1.12,
    height: 0.72,
    roofX: 0.44,
    roofWidth: 0.3,
    roofHeight: 0.34,
    wheelBase: 0.68,
    roundness: 0.16,
    stance: "sharp",
  },
  {
    id: "g-class",
    name: "벤츠 G클래스",
    label: "2026 벤츠 G클래스",
    image: "./assets/cars/car-08.webp",
    flipInRace: true,
    color: "#1d4ed8",
    width: 0.98,
    height: 1.16,
    roofX: 0.28,
    roofWidth: 0.52,
    roofHeight: 0.55,
    wheelBase: 0.58,
    roundness: 0.05,
    stance: "boxy",
  },
  {
    id: "korando",
    name: "쌍용 코란도 하이 디럭스",
    label: "1992 코란도 하이 디럭스",
    image: "./assets/cars/car-09.webp",
    flipInRace: true,
    color: "#0f172a",
    width: 1,
    height: 1.14,
    roofX: 0.27,
    roofWidth: 0.54,
    roofHeight: 0.55,
    wheelBase: 0.6,
    roundness: 0.06,
    stance: "boxy",
  },
  {
    id: "model-s",
    name: "테슬라 모델 S",
    label: "2025 테슬라 모델 S",
    image: "./assets/cars/car-10.webp",
    flipInRace: true,
    color: "#3b82f6",
    width: 1.2,
    height: 0.74,
    roofX: 0.43,
    roofWidth: 0.38,
    roofHeight: 0.33,
    wheelBase: 0.72,
    roundness: 0.22,
    stance: "low",
  },
];

const DEFAULT_STATE = {
  screen: "home",
  playerCount: 6,
  players: Array.from({ length: 10 }, (_, index) => ({
    id: `player-${index + 1}`,
    carNo: index + 1,
    carType: CAR_DEFS[index]?.id ?? CAR_DEFS[0].id,
    selectedOrder: null,
    reactionMs: 0,
    finishTime: null,
    progress: 0,
    speed: 0,
    finished: false,
  })),
  race: null,
};

const state = structuredClone(DEFAULT_STATE);
const app = document.querySelector("#app");
let animationFrameId = null;
const carImageCache = new Map();

function preloadCarImages() {
  CAR_DEFS.forEach(loadCarImage);
}

function loadCarImage(carDef) {
  if (!carDef.image || typeof Image === "undefined") return null;
  if (carImageCache.has(carDef.id)) return carImageCache.get(carDef.id);

  const entry = {
    image: new Image(),
    loaded: false,
    failed: false,
  };

  entry.image.onload = () => {
    entry.loaded = true;
    if (state.screen === "race") drawRaceCanvas();
  };
  entry.image.onerror = () => {
    entry.failed = true;
  };
  entry.image.src = carDef.image;
  carImageCache.set(carDef.id, entry);
  return entry;
}

function loadedCarImage(carDef) {
  const entry = loadCarImage(carDef);
  if (!entry?.loaded || entry.failed || entry.image.naturalWidth === 0) return null;
  return entry.image;
}

function selectedPlayers() {
  return state.players
    .filter((player) => player.selectedOrder !== null)
    .sort((a, b) => a.selectedOrder - b.selectedOrder);
}

function visiblePlayers() {
  return state.players;
}

function colorFor(player) {
  return carDefFor(player).color ?? PLAYER_COLORS[player.carNo - 1] ?? "#94a3b8";
}

function carHash(player) {
  return `#${player.carNo}`;
}

function carDefFor(player) {
  return CAR_DEFS.find((car) => car.id === player.carType) ?? CAR_DEFS[(player.carNo - 1) % CAR_DEFS.length];
}

function carDisplayName(player) {
  return carDefFor(player).name;
}

function setScreen(screen) {
  state.screen = screen;
  cancelRaceLoop();
  render();
}

function normalizeSelectionOrder() {
  selectedPlayers().forEach((player, index) => {
    player.selectedOrder = index + 1;
  });
}

function togglePlayer(playerId) {
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player) return;

  if (player.selectedOrder === null) {
    if (selectedPlayers().length >= state.playerCount) return;
    player.selectedOrder = selectedPlayers().length + 1;
  } else {
    player.selectedOrder = null;
    normalizeSelectionOrder();
  }

  render();
}

function updatePlayerCount(count) {
  state.playerCount = count;
  selectedPlayers().forEach((player, index) => {
    if (index >= count) {
      player.selectedOrder = null;
    }
  });
  normalizeSelectionOrder();
  render();
}

function createRaceEvents(players) {
  const superBoostCount = Math.min(players.length, Math.random() < 0.7 ? 1 : 2);
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const events = new Map();

  shuffled.slice(0, superBoostCount).forEach((player, index) => {
    const type = superBoostCount === 2 ? (index === 0 ? "early" : "late") : Math.random() < 0.52 ? "early" : "late";
    const early = type === "early";
    const start = early ? 850 + Math.random() * 1450 : 0.6 + Math.random() * 0.18;
    const duration = early ? 1050 + Math.random() * 650 : 0.14 + Math.random() * 0.08;

    events.set(player.id, {
      superBoostType: type,
      superBoostStart: start,
      superBoostEnd: early ? start + duration : Math.min(0.93, start + duration),
      superBoostMultiplier: early ? 1.22 + Math.random() * 0.18 : 1.34 + Math.random() * 0.24,
    });
  });

  return events;
}

function prepareRace() {
  const selected = selectedPlayers();
  const raceEvents = createRaceEvents(selected);
  const racers = selected.map((player, index) => {
    const superBoost = raceEvents.get(player.id);
    return {
      ...player,
      lane: index,
      reactionMs: Math.round(40 + Math.random() * 190),
      acceleration: 0.000000056 + Math.random() * 0.00000003,
      maxSpeed: 0.000097 + Math.random() * 0.000028,
      launchQuality: -0.000008 + Math.random() * 0.000024,
      nitroAt: 0.28 + Math.random() * 0.34,
      nitroUsed: false,
      boostStartedAt: null,
      boostEndsAt: null,
      boostLabelUntil: null,
      superBoostType: superBoost?.superBoostType ?? null,
      superBoostStart: superBoost?.superBoostStart ?? null,
      superBoostEnd: superBoost?.superBoostEnd ?? null,
      superBoostMultiplier: superBoost?.superBoostMultiplier ?? 1,
      superBoostTriggeredAt: null,
      superBoostLabelUntil: null,
      isSuperBoosting: false,
      surgeStartAt: 2600 + Math.random() * 3200,
      surgeDuration: 900 + Math.random() * 900,
      surgeStrength: 0.000009 + Math.random() * 0.000017,
      burstStartAt: 4200 + Math.random() * 3600,
      burstDuration: 420 + Math.random() * 460,
      burstStrength: 0.000014 + Math.random() * 0.000019,
      slowdownStartAt: 5200 + Math.random() * 3000,
      slowdownDuration: 420 + Math.random() * 520,
      slowdownStrength: 0.000005 + Math.random() * 0.000011,
      surgePhase: Math.random() * Math.PI * 2,
      surgeRate: 0.0018 + Math.random() * 0.0012,
      progress: 0,
      speed: 0,
      finishTime: null,
      finished: false,
    };
  });

  state.race = {
    status: "ready",
    startedAt: null,
    countdownStartedAt: null,
    lastFrameAt: null,
    elapsedMs: 0,
    racers,
    ranking: [],
    drinkBuyerId: null,
    winnerId: null,
  };

  setScreen("launch");
}

function startCountdown() {
  if (!state.race) return;
  state.race.status = "countdown";
  state.race.countdownStartedAt = performance.now();
  setScreen("race");
}

function startRaceNow(now = performance.now()) {
  if (!state.race) return;
  state.race.status = "running";
  state.race.startedAt = now;
  state.race.lastFrameAt = now;
  state.race.elapsedMs = 0;
  state.race.ranking = [];
  requestRaceFrame();
}

function finishRace() {
  if (!state.race) return;

  const ranking = [...state.race.racers].sort((a, b) => {
    if (a.finishTime === null && b.finishTime === null) return b.progress - a.progress;
    if (a.finishTime === null) return 1;
    if (b.finishTime === null) return -1;
    return a.finishTime - b.finishTime;
  });

  state.race.ranking = ranking;
  state.race.winnerId = ranking[0]?.id ?? null;
  state.race.drinkBuyerId = ranking[ranking.length - 1]?.id ?? null;
  setScreen("result");
}

function cancelRaceLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function requestRaceFrame() {
  cancelRaceLoop();
  animationFrameId = requestAnimationFrame(tickRace);
}

function tickRace(now) {
  const race = state.race;
  if (!race) return;

  if (race.status === "countdown") {
    const elapsed = now - race.countdownStartedAt;
    race.elapsedMs = elapsed;
    drawRaceCanvas(now);

    if (elapsed >= 3000) {
      startRaceNow(now);
      return;
    }

    animationFrameId = requestAnimationFrame(tickRace);
    return;
  }

  if (race.status !== "running" || race.startedAt === null) return;

  const elapsed = now - race.startedAt;
  const frameMs = Math.min(34, Math.max(12, now - (race.lastFrameAt ?? now)));
  race.elapsedMs = elapsed;
  race.lastFrameAt = now;

  race.racers.forEach((racer) => {
    if (racer.finished) return;

    if (elapsed < racer.reactionMs) {
      racer.speed *= 0.84;
      return;
    }

    if (!racer.nitroUsed && racer.progress >= racer.nitroAt) {
      racer.nitroUsed = true;
      racer.boostStartedAt = elapsed;
      racer.boostEndsAt = elapsed + 640 + Math.random() * 520;
      racer.boostLabelUntil = elapsed + 760;
      racer.speed += 0.000029;
    }

    const superBoostActive = isSuperBoostWindow(racer, elapsed);
    if (superBoostActive && !racer.isSuperBoosting) {
      racer.superBoostTriggeredAt = elapsed;
      racer.superBoostLabelUntil = elapsed + (racer.superBoostType === "late" ? 1250 : 1050);
      racer.speed += (racer.superBoostType === "late" ? 0.00004 : 0.000034) * racer.superBoostMultiplier;
    }
    racer.isSuperBoosting = superBoostActive;

    const boostActive = racer.boostEndsAt !== null && elapsed <= racer.boostEndsAt;
    const middleRaceSurge = racer.progress > 0.18 && racer.progress < 0.88;
    const launchKick = elapsed < 2400 ? racer.launchQuality * (1 - elapsed / 2400) : 0;
    const surgeWindow = eventPulse(elapsed, racer.surgeStartAt, racer.surgeDuration);
    const burstWindow = eventPulse(elapsed, racer.burstStartAt, racer.burstDuration);
    const slowdownWindow = eventPulse(elapsed, racer.slowdownStartAt, racer.slowdownDuration);
    const surgeWave = middleRaceSurge ? Math.sin(elapsed * racer.surgeRate + racer.surgePhase) * 0.00001 : 0;
    const tractionNoise = Math.sin(elapsed * 0.0046 + racer.carNo * 1.7) * 0.000006;
    const eventSpeed =
      launchKick +
      racer.surgeStrength * surgeWindow +
      racer.burstStrength * burstWindow -
      racer.slowdownStrength * slowdownWindow;
    const superBoostBonus = superBoostActive
      ? (racer.superBoostType === "late" ? 0.000052 : 0.000046) * racer.superBoostMultiplier
      : 0;
    const targetMaxSpeed = racer.maxSpeed + surgeWave + tractionNoise + eventSpeed + superBoostBonus + (boostActive ? 0.00004 : 0);
    const superBoostAcceleration = superBoostActive ? racer.acceleration * frameMs * (racer.superBoostMultiplier - 0.5) : 0;

    racer.speed = Math.min(Math.max(targetMaxSpeed, 0.00007), racer.speed + racer.acceleration * frameMs + superBoostAcceleration);
    racer.speed *= superBoostActive ? 1.0002 : boostActive || burstWindow > 0 ? 0.999 : 0.997;
    racer.progress = Math.min(1, racer.progress + racer.speed * frameMs);

    if (racer.progress >= 1) {
      racer.finished = true;
      racer.finishTime = elapsed / 1000;
      race.ranking = [...race.ranking, racer];
    }
  });

  drawRaceCanvas(now);

  const allFinished = race.racers.every((racer) => racer.finished);
  if (allFinished || elapsed > 13800) {
    race.racers.forEach((racer) => {
      if (racer.finishTime === null) {
        racer.finishTime = elapsed / 1000 + (1 - racer.progress);
      }
      racer.finished = true;
    });
    finishRace();
    return;
  }

  animationFrameId = requestAnimationFrame(tickRace);
}

function eventPulse(elapsed, startAt, duration) {
  if (elapsed < startAt || elapsed > startAt + duration) return 0;
  const t = (elapsed - startAt) / duration;
  return Math.sin(t * Math.PI);
}

function isSuperBoostWindow(racer, elapsed) {
  if (!racer.superBoostType || racer.superBoostStart === null || racer.superBoostEnd === null) return false;
  if (racer.superBoostType === "early") {
    return elapsed >= racer.superBoostStart && elapsed <= racer.superBoostEnd;
  }
  return racer.progress >= racer.superBoostStart && racer.progress <= racer.superBoostEnd;
}

function superBoostLabel(racer) {
  return racer.superBoostType === "late" ? "COMEBACK BOOST!" : "SUPER BOOST!";
}

function html(strings, ...values) {
  return strings.reduce((result, chunk, index) => {
    return result + chunk + (values[index] ?? "");
  }, "");
}

function render() {
  app.innerHTML = "";
  app.className = `app-shell screen-${state.screen}`;

  if (state.screen === "home") renderHome();
  if (state.screen === "lobby") renderLobby();
  if (state.screen === "launch") renderLaunch();
  if (state.screen === "race") renderRace();
  if (state.screen === "result") renderResult();
}

function renderHome() {
  app.innerHTML = html`
    <main class="home-layout">
      <section class="hero">
        <p class="eyebrow">Office Drink Bet Game</p>
        <h1>Drag Racing</h1>
        <p class="hero-copy">자동차를 고르고, 짧은 400m 레이스로 오늘 음료수 담당을 정합니다.</p>
        <div class="button-row">
          <button class="primary-button" data-action="go-lobby">로비 만들기</button>
          <button class="ghost-button" data-action="quick-start">6대 빠른 시작</button>
        </div>
      </section>
      <section class="feature-strip" aria-label="게임 흐름">
        <div><strong>1</strong><span>자동차 선택</span></div>
        <div><strong>2</strong><span>출발 준비</span></div>
        <div><strong>3</strong><span>400m 레이스</span></div>
        <div><strong>4</strong><span>음료수 담당 발표</span></div>
      </section>
    </main>
  `;

  app.querySelector("[data-action='go-lobby']").addEventListener("click", () => setScreen("lobby"));
  app.querySelector("[data-action='quick-start']").addEventListener("click", () => {
    updatePlayerCount(6);
    state.players.forEach((player, index) => {
      player.selectedOrder = index < 6 ? index + 1 : null;
    });
    prepareRace();
  });
}

function renderLobby() {
  const selected = selectedPlayers();
  app.innerHTML = html`
    <main class="page-layout lobby-layout">
      <header class="top-bar">
        <button class="icon-button" data-action="home" aria-label="홈으로">←</button>
        <div>
          <p class="eyebrow">Mock Lobby</p>
          <h1>자동차 선택</h1>
        </div>
      </header>

      <section class="lobby-controls" aria-label="로비 설정">
        <div class="segmented-control" role="group" aria-label="최대 참가 자동차 수">
          ${[2, 4, 6, 8, 10]
            .map(
              (count) => html`
                <button class="${state.playerCount === count ? "active" : ""}" data-count="${count}">
                  최대 ${count}대
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="selection-summary">
          <strong>${selected.length}/${state.playerCount}</strong>
          <span>대 선택됨</span>
        </div>
      </section>

      <section class="player-grid" aria-label="자동차 목록">
        ${visiblePlayers().map(renderPlayerCard).join("")}
      </section>

      <footer class="bottom-action">
        <div>
          <strong>선택된 자동차</strong>
          <span>${selected.length > 0 ? selected.map((player) => `${carHash(player)} ${escapeHtml(carDefFor(player).name)}`).join(" · ") : "10대 중 레이스에 참가할 자동차를 고르세요"}</span>
        </div>
        <button class="primary-button" data-action="prepare" ${selected.length < 2 ? "disabled" : ""}>
          레이스 준비
        </button>
      </footer>
    </main>
  `;

  app.querySelector("[data-action='home']").addEventListener("click", () => setScreen("home"));
  app.querySelector("[data-action='prepare']").addEventListener("click", prepareRace);
  app.querySelectorAll("[data-count]").forEach((button) => {
    button.addEventListener("click", () => updatePlayerCount(Number(button.dataset.count)));
  });
  app.querySelectorAll("[data-player-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      togglePlayer(card.dataset.playerCard);
    });
  });
  wireCarPreviewFallbacks();
}

function wireCarPreviewFallbacks() {
  app.querySelectorAll("[data-car-img]").forEach((image) => {
    const fallback = image.nextElementSibling;
    const showFallback = () => {
      image.hidden = true;
      if (fallback) fallback.hidden = false;
    };

    if (image.complete && image.naturalWidth === 0) showFallback();
    image.addEventListener("error", showFallback);
  });
}

function renderPlayerCard(player) {
  const selected = player.selectedOrder !== null;
  const carDef = carDefFor(player);
  const locked = !selected && selectedPlayers().length >= state.playerCount;
  return html`
    <article class="player-card ${selected ? "selected" : ""} ${locked ? "locked" : ""}" data-player-card="${player.id}" style="--player-color: ${colorFor(player)}">
      <div class="player-card-header">
        <span class="slot-badge">${carHash(player)}</span>
        <span class="selection-badge">${selected ? "참가" : locked ? "마감" : "대기"}</span>
      </div>
      <figure class="car-preview">
        <img class="car-photo" data-car-img src="${escapeAttribute(carDef.image)}" alt="${escapeAttribute(carDef.name)}" loading="eager" draggable="false" />
        <svg class="car-preview-fallback" viewBox="0 0 160 82" aria-hidden="true" hidden>
          ${renderCarSvg(player, carDef)}
        </svg>
      </figure>
      <strong class="car-name">${escapeHtml(carDisplayName(player))}</strong>
    </article>
  `;
}

function renderCarSvg(player, carDef) {
  const color = colorFor(player);
  const bodyWidth = 86 * carDef.width;
  const bodyHeight = 30 * carDef.height;
  const bodyX = 80 - bodyWidth / 2;
  const bodyY = 42 - bodyHeight / 2;
  const roofWidth = bodyWidth * carDef.roofWidth;
  const roofHeight = bodyHeight * carDef.roofHeight;
  const roofX = bodyX + bodyWidth * carDef.roofX;
  const roofY = bodyY - roofHeight * 0.82;
  const wheelRadius = Math.max(6, bodyHeight * 0.28);
  const rearWheelX = bodyX + bodyWidth * ((1 - carDef.wheelBase) / 2 + 0.06);
  const frontWheelX = bodyX + bodyWidth * (1 - (1 - carDef.wheelBase) / 2 - 0.08);
  const wheelY = bodyY + bodyHeight + 2;
  const bodyRadius = Math.max(3, bodyHeight * carDef.roundness);
  const roofRadius = carDef.stance === "boxy" ? 3 : 8;
  const hoodY = carDef.stance === "sharp" || carDef.stance === "low" ? bodyY + bodyHeight * 0.18 : bodyY + bodyHeight * 0.08;

  return html`
    <ellipse cx="80" cy="${wheelY + 5}" rx="${bodyWidth * 0.58}" ry="8" fill="rgba(2,6,23,0.45)" />
    <path d="
      M ${bodyX + bodyRadius} ${bodyY}
      L ${bodyX + bodyWidth * 0.22} ${hoodY}
      L ${bodyX + bodyWidth - bodyRadius} ${bodyY + bodyHeight * 0.08}
      Q ${bodyX + bodyWidth} ${bodyY + bodyHeight * 0.08} ${bodyX + bodyWidth} ${bodyY + bodyRadius}
      L ${bodyX + bodyWidth} ${bodyY + bodyHeight - bodyRadius}
      Q ${bodyX + bodyWidth} ${bodyY + bodyHeight} ${bodyX + bodyWidth - bodyRadius} ${bodyY + bodyHeight}
      L ${bodyX + bodyRadius} ${bodyY + bodyHeight}
      Q ${bodyX} ${bodyY + bodyHeight} ${bodyX} ${bodyY + bodyHeight - bodyRadius}
      L ${bodyX} ${bodyY + bodyRadius}
      Q ${bodyX} ${bodyY} ${bodyX + bodyRadius} ${bodyY}
      Z"
      fill="${color}"
    />
    <rect x="${roofX}" y="${roofY}" width="${roofWidth}" height="${roofHeight}" rx="${roofRadius}" fill="rgba(15,23,42,0.88)" />
    <rect x="${roofX + roofWidth * 0.13}" y="${roofY + roofHeight * 0.17}" width="${roofWidth * 0.33}" height="${roofHeight * 0.54}" rx="3" fill="rgba(186,230,253,0.28)" />
    <rect x="${roofX + roofWidth * 0.53}" y="${roofY + roofHeight * 0.17}" width="${roofWidth * 0.33}" height="${roofHeight * 0.54}" rx="3" fill="rgba(186,230,253,0.22)" />
    <rect x="${bodyX + bodyWidth - 5}" y="${bodyY + bodyHeight * 0.26}" width="7" height="5" rx="2" fill="#f8fafc" />
    <rect x="${bodyX + bodyWidth - 5}" y="${bodyY + bodyHeight * 0.58}" width="7" height="5" rx="2" fill="#f8fafc" />
    <circle cx="${rearWheelX}" cy="${wheelY}" r="${wheelRadius}" fill="#020617" stroke="#475569" stroke-width="3" />
    <circle cx="${frontWheelX}" cy="${wheelY}" r="${wheelRadius}" fill="#020617" stroke="#475569" stroke-width="3" />
    <text x="${bodyX + bodyWidth * 0.24}" y="${bodyY + bodyHeight * 0.62}" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="900">${player.carNo}</text>
  `;
}

function renderLaunch() {
  const racers = state.race?.racers ?? selectedPlayers();
  app.innerHTML = html`
    <main class="page-layout launch-layout">
      <header class="top-bar">
        <button class="icon-button" data-action="back-lobby" aria-label="로비로">←</button>
        <div>
          <p class="eyebrow">Launch</p>
          <h1>출발 준비</h1>
        </div>
        <button class="ghost-button compact" data-action="reshuffle">컨디션 다시 뽑기</button>
      </header>

      <section class="launch-grid">
        ${racers
          .map((racer) => {
            const carDef = carDefFor(racer);
            return html`
              <article class="lane-card" style="--player-color: ${colorFor(racer)}">
                <span>${carHash(racer)} · ${escapeHtml(carDef.label)}</span>
                <strong>${escapeHtml(carDisplayName(racer))}</strong>
                <small>반응속도 예상 ${racer.reactionMs || Math.round(180 + Math.random() * 520)}ms</small>
              </article>
            `;
          })
          .join("")}
      </section>

      <section class="start-panel">
        <p>참가 자동차가 출발선에 섰습니다. 마지막으로 들어오는 자동차가 오늘 음료수 담당입니다.</p>
        <button class="primary-button jumbo" data-action="start-countdown">카운트다운 시작</button>
      </section>
    </main>
  `;

  app.querySelector("[data-action='back-lobby']").addEventListener("click", () => setScreen("lobby"));
  app.querySelector("[data-action='reshuffle']").addEventListener("click", prepareRace);
  app.querySelector("[data-action='start-countdown']").addEventListener("click", startCountdown);
}

function renderRace() {
  const race = state.race;
  app.innerHTML = html`
    <main class="race-layout">
      <header class="race-header">
        <div>
          <p class="eyebrow">Race</p>
          <h1>400m Drag</h1>
        </div>
        <p class="race-rule">마지막 도착 자동차가 음료수 담당</p>
        <button class="ghost-button compact" data-action="abort">로비로</button>
      </header>
      <section class="race-stage">
        <canvas id="raceCanvas" aria-label="드래그 레이싱 트랙"></canvas>
        <div id="countdown" class="countdown"></div>
      </section>
    </main>
  `;

  app.querySelector("[data-action='abort']").addEventListener("click", () => setScreen("lobby"));
  drawRaceCanvas();

  if (race?.status === "countdown" || race?.status === "running") {
    requestRaceFrame();
  }
}

function resizeRaceCanvas(canvas) {
  const stage = canvas.parentElement;
  const rect = stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(360, Math.floor(rect.width));
  const height = Math.max(220, Math.floor(rect.height));

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function drawRaceCanvas(now = performance.now()) {
  const canvas = document.querySelector("#raceCanvas");
  const countdown = document.querySelector("#countdown");
  if (!canvas || !state.race) return;

  const { ctx, width, height } = resizeRaceCanvas(canvas);
  const race = state.race;
  const racers = race.racers;
  const activeElapsed = race.status === "running" ? race.elapsedMs : Math.max(0, now - (race.countdownStartedAt ?? now));
  const roadOffset = race.status === "running" ? activeElapsed * 0.7 : activeElapsed * 0.04;
  const horizontalPadding = Math.max(28, width * 0.035);
  const labelWidth = Math.min(128, Math.max(72, width * 0.12));
  const startX = horizontalPadding + labelWidth + 20;
  const finishX = width - horizontalPadding - 20;
  const trackTop = Math.max(38, height * 0.1);
  const trackBottom = height - Math.max(18, height * 0.045);
  const trackHeight = Math.max(170, trackBottom - trackTop);
  const laneHeight = Math.max(16, Math.min(58, trackHeight / racers.length));
  const usedHeight = laneHeight * racers.length;
  const top = trackTop + Math.max(0, (trackHeight - usedHeight) / 2);

  ctx.clearRect(0, 0, width, height);
  drawRaceBackground(ctx, width, height, roadOffset, race.status, top - 8, usedHeight + 16, laneHeight);

  ctx.fillStyle = "rgba(248, 250, 252, 0.92)";
  ctx.font = `${Math.max(14, Math.min(24, height * 0.045))}px system-ui`;
  ctx.textBaseline = "middle";
  ctx.fillText("DRAG STRIP 400m", horizontalPadding, Math.max(24, trackTop - 22));

  racers.forEach((racer, index) => {
    const y = top + index * laneHeight;
    drawLane(ctx, racer, index, y, laneHeight, startX, finishX, labelWidth, roadOffset, race.elapsedMs);
  });

  drawStartLine(ctx, startX, top - 8, usedHeight + 16);
  drawFinishLine(ctx, finishX, top - 8, usedHeight + 16);

  if (countdown && race.status === "countdown") {
    const elapsed = now - race.countdownStartedAt;
    const left = Math.max(0, 3 - Math.floor(elapsed / 1000));
    countdown.textContent = left > 0 ? String(left) : "GO";
  } else if (countdown) {
    countdown.textContent = "";
  }
}

function drawRaceBackground(ctx, width, height, offset, status, trackY, trackHeight, laneHeight) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#172033");
  sky.addColorStop(0.46, "#233047");
  sky.addColorStop(1, "#101827");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const grassTop = Math.max(0, trackY - 34);
  const grassBottom = Math.min(height, trackY + trackHeight + 34);
  ctx.fillStyle = "#24451f";
  ctx.fillRect(0, grassTop, width, Math.max(0, trackY - grassTop));
  ctx.fillRect(0, trackY + trackHeight, width, Math.max(0, grassBottom - trackY - trackHeight));

  ctx.fillStyle = "rgba(132, 204, 22, 0.18)";
  for (let i = 0; i < 34; i += 1) {
    const x = (i * 83 - offset * 0.16) % (width + 90);
    ctx.fillRect(x - 30, grassTop + 6 + (i % 3) * 6, 42, 2);
    ctx.fillRect(width - x, grassBottom - 18 - (i % 4) * 4, 54, 2);
  }

  drawGuardRail(ctx, width, trackY - 16, offset, status);
  drawGuardRail(ctx, width, trackY + trackHeight + 12, offset, status);

  const road = ctx.createLinearGradient(0, trackY, 0, trackY + trackHeight);
  road.addColorStop(0, "#5b6472");
  road.addColorStop(0.08, "#394150");
  road.addColorStop(0.5, "#252b34");
  road.addColorStop(0.92, "#363d49");
  road.addColorStop(1, "#626b78");
  ctx.fillStyle = road;
  ctx.fillRect(18, trackY, width - 36, trackHeight);

  const textureShift = status === "running" ? offset * 1.25 : offset * 0.08;
  for (let i = 0; i < 220; i += 1) {
    const x = (i * 47 - textureShift) % (width + 80);
    const y = trackY + ((i * 31) % Math.max(1, trackHeight));
    const alpha = 0.05 + (i % 5) * 0.018;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x - 40, y, 2 + (i % 4), 1);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.78)";
  ctx.lineWidth = Math.max(2, laneHeight * 0.035);
  ctx.beginPath();
  ctx.moveTo(18, trackY + 2);
  ctx.lineTo(width - 18, trackY + 2);
  ctx.moveTo(18, trackY + trackHeight - 2);
  ctx.lineTo(width - 18, trackY + trackHeight - 2);
  ctx.stroke();
}

function drawGuardRail(ctx, width, y, offset, status) {
  ctx.save();
  ctx.strokeStyle = "rgba(226,232,240,0.68)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.moveTo(0, y + 8);
  ctx.lineTo(width, y + 8);
  ctx.stroke();

  const postOffset = (status === "running" ? offset * 0.58 : offset * 0.05) % 120;
  ctx.fillStyle = "rgba(148,163,184,0.55)";
  for (let x = width + 40 - postOffset; x > -80; x -= 120) {
    ctx.fillRect(x, y - 5, 8, 20);
  }
  ctx.restore();
}

function drawLane(ctx, racer, index, y, laneHeight, startX, finishX, labelWidth, offset, elapsedMs) {
  const laneCenter = y + laneHeight / 2;
  const color = colorFor(racer);
  const laneLeft = Math.max(18, startX - labelWidth);
  const laneRight = finishX + 18;
  const boostActive = racer.boostEndsAt !== null && elapsedMs <= racer.boostEndsAt;
  const superBoostActive = racer.isSuperBoosting === true;
  const visualBoostActive = boostActive || superBoostActive;
  const boostAge = boostActive ? Math.max(0, elapsedMs - racer.boostStartedAt) : 0;
  const superBoostAge = superBoostActive ? Math.max(0, elapsedMs - (racer.superBoostTriggeredAt ?? elapsedMs)) : 0;
  const boostPulse = (boostActive ? Math.sin(boostAge / 36) * 2.4 : 0) + (superBoostActive ? Math.sin(superBoostAge / 28) * 4.4 : 0);
  const carScale = superBoostActive ? 1.16 + Math.sin(superBoostAge / 42) * 0.06 : boostActive ? 1.08 + Math.sin(boostAge / 48) * 0.05 : 1;
  const carBox = raceCarDimensions(racer, laneHeight, carScale);
  const travelWidth = Math.max(0, finishX - startX - carBox.width);
  const carX = startX + carBox.width / 2 + travelWidth * racer.progress;
  const speedRatio = Math.min(1.35, Math.max(0, racer.speed / 0.00017));
  const vibration = Math.sin(elapsedMs * 0.052 + racer.carNo * 1.9) * Math.min(3.2, speedRatio * 2.15);
  const foreAftShake = Math.sin(elapsedMs * 0.033 + racer.carNo) * Math.min(2.4, speedRatio * 1.6);
  const displayCarX = carX + boostPulse + foreAftShake;
  const displayCarY = laneCenter + vibration;
  const rearX = displayCarX - carBox.width * 0.43;
  const rearY = displayCarY + Math.min(2, laneHeight * 0.04);
  const compactLane = laneHeight < 34;
  const carDef = carDefFor(racer);

  ctx.fillStyle = index % 2 === 0 ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.058)";
  ctx.fillRect(laneLeft, y + 1, laneRight - laneLeft, laneHeight - 2);

  const stripeOffset = offset % 76;
  ctx.strokeStyle = "rgba(248,250,252,0.55)";
  ctx.setLineDash([34, 28]);
  ctx.lineDashOffset = -stripeOffset;
  ctx.lineWidth = Math.max(1, laneHeight * 0.035);
  ctx.beginPath();
  ctx.moveTo(startX + 14, y + laneHeight - 1);
  ctx.lineTo(finishX - 16, y + laneHeight - 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;

  ctx.fillStyle = "rgba(2,6,23,0.38)";
  roundedRect(ctx, laneLeft + 4, y + Math.max(3, laneHeight * 0.08), labelWidth - 10, Math.max(26, laneHeight * 0.78), 6);
  ctx.fill();

  ctx.fillStyle = "rgba(248,250,252,0.94)";
  ctx.font = `900 ${Math.max(10, Math.min(15, laneHeight * 0.27))}px system-ui`;
  ctx.textBaseline = "middle";
  ctx.fillText(trimCanvasText(carDef.name, compactLane ? 8 : 11), laneLeft + 10, compactLane ? laneCenter : laneCenter - Math.min(9, laneHeight * 0.12));

  if (!compactLane) {
    ctx.fillStyle = "rgba(226,232,240,0.72)";
    ctx.font = `600 ${Math.max(10, Math.min(14, laneHeight * 0.24))}px system-ui`;
    ctx.fillText(carHash(racer), laneLeft + 10, laneCenter + Math.min(11, laneHeight * 0.22));
  }

  if (racer.speed > 0 && !racer.finished) {
    drawRoadDust(ctx, rearX, rearY, speedRatio, elapsedMs, laneHeight);
    drawMotionStreaks(ctx, rearX, rearY, color, speedRatio, boostActive, laneHeight, superBoostActive);
    drawExhaust(ctx, rearX, rearY, color, racer.speed, boostActive, boostPulse, laneHeight, superBoostActive);
  }

  drawCar(ctx, displayCarX, displayCarY, laneHeight, color, carScale, racer, visualBoostActive, carBox);
  drawWheelSpin(ctx, displayCarX, displayCarY, carBox, speedRatio, elapsedMs, laneHeight);

  if (racer.superBoostLabelUntil !== null && elapsedMs <= racer.superBoostLabelUntil) {
    const labelAlpha = Math.max(0, (racer.superBoostLabelUntil - elapsedMs) / 1200);
    ctx.save();
    ctx.globalAlpha = labelAlpha;
    ctx.fillStyle = racer.superBoostType === "late" ? "#67e8f9" : "#fef08a";
    ctx.shadowColor = racer.superBoostType === "late" ? "#22d3ee" : "#f97316";
    ctx.shadowBlur = 18;
    ctx.font = `900 ${Math.max(13, Math.min(24, laneHeight * 0.4))}px system-ui`;
    ctx.fillText(superBoostLabel(racer), Math.min(finishX - 154, displayCarX + carBox.width * 0.32), displayCarY - laneHeight * 0.28);
    ctx.restore();
  } else if (racer.boostLabelUntil !== null && elapsedMs <= racer.boostLabelUntil) {
    const labelAlpha = Math.max(0, (racer.boostLabelUntil - elapsedMs) / 900);
    ctx.save();
    ctx.globalAlpha = labelAlpha;
    ctx.fillStyle = "#fdba74";
    ctx.font = `900 ${Math.max(12, Math.min(22, laneHeight * 0.36))}px system-ui`;
    ctx.fillText("BOOST!", Math.min(finishX - 86, displayCarX + carBox.width * 0.34), displayCarY - laneHeight * 0.25);
    ctx.restore();
  }
}

function drawRoadDust(ctx, rearX, y, speedRatio, elapsedMs, laneHeight) {
  if (speedRatio <= 0.08) return;

  ctx.save();
  const particleCount = Math.min(7, Math.max(2, Math.round(speedRatio * 5)));
  for (let i = 0; i < particleCount; i += 1) {
    const drift = (elapsedMs * (0.018 + i * 0.004) + i * 23) % Math.max(24, laneHeight * 1.6);
    const x = rearX - 8 - drift - i * 8;
    const yy = y + laneHeight * 0.23 + Math.sin(elapsedMs * 0.01 + i) * laneHeight * 0.08;
    const radius = Math.max(1, laneHeight * (0.025 + i * 0.003));
    ctx.fillStyle = `rgba(203, 213, 225, ${Math.max(0.04, 0.2 - i * 0.022) * speedRatio})`;
    ctx.beginPath();
    ctx.arc(x, yy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMotionStreaks(ctx, rearX, y, color, speedRatio, boostActive, laneHeight, superBoostActive = false) {
  if (speedRatio <= 0.1) return;

  const count = superBoostActive ? 8 : boostActive ? 5 : 3;
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < count; i += 1) {
    const length = laneHeight * ((superBoostActive ? 1.35 : 0.75) + speedRatio * (superBoostActive ? 2.35 : 1.35) + i * 0.28);
    const yy = y - laneHeight * 0.22 + i * laneHeight * 0.14;
    ctx.strokeStyle = superBoostActive ? (i % 2 === 0 ? "#fef08a" : "#38bdf8") : boostActive ? color : `rgba(226,232,240,${0.13 + speedRatio * 0.11})`;
    ctx.globalAlpha = superBoostActive ? 0.5 : boostActive ? 0.35 : 0.42;
    ctx.lineWidth = Math.max(1, laneHeight * ((superBoostActive ? 0.024 : 0.018) + i * 0.003));
    ctx.beginPath();
    ctx.moveTo(rearX - 4, yy);
    ctx.lineTo(rearX - length, yy + Math.sin(i) * laneHeight * 0.03);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWheelSpin(ctx, x, y, carBox, speedRatio, elapsedMs, laneHeight) {
  if (speedRatio <= 0.1) return;

  const wheelY = y + carBox.height * 0.31;
  const wheelRadius = Math.max(4, Math.min(11, carBox.height * 0.18));
  const wheelXs = [x - carBox.width * 0.29, x + carBox.width * 0.29];
  const spin = elapsedMs * 0.02 * (0.7 + speedRatio);

  ctx.save();
  ctx.strokeStyle = `rgba(248,250,252,${Math.min(0.72, 0.28 + speedRatio * 0.28)})`;
  ctx.lineWidth = Math.max(1, laneHeight * 0.018);
  wheelXs.forEach((wheelX, index) => {
    for (let arc = 0; arc < 2; arc += 1) {
      const start = spin + index + arc * Math.PI;
      ctx.beginPath();
      ctx.arc(wheelX, wheelY, wheelRadius + arc * 2, start, start + Math.PI * 0.72);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawExhaust(ctx, rearX, laneCenter, color, speed, boostActive, boostPulse, laneHeight, superBoostActive = false) {
  const trailLength = superBoostActive ? 128 + speed * 680000 : boostActive ? 82 + speed * 430000 : 30 + speed * 170000;
  const flameHeight = superBoostActive ? Math.max(10, laneHeight * 0.34) : boostActive ? Math.max(7, laneHeight * 0.22) : Math.max(3, laneHeight * 0.11);
  const gradient = ctx.createLinearGradient(rearX - trailLength, laneCenter, rearX, laneCenter);
  gradient.addColorStop(0, superBoostActive ? "rgba(56, 189, 248, 0)" : "rgba(249, 115, 22, 0)");
  gradient.addColorStop(0.24, superBoostActive ? "rgba(56, 189, 248, 0.42)" : boostActive ? "rgba(249, 115, 22, 0.35)" : "rgba(148, 163, 184, 0.18)");
  gradient.addColorStop(0.62, superBoostActive ? "rgba(254, 240, 138, 0.48)" : boostActive ? "rgba(249, 115, 22, 0.35)" : "rgba(148, 163, 184, 0.18)");
  gradient.addColorStop(1, superBoostActive ? "#fef08a" : boostActive ? color : "rgba(226,232,240,0.32)");

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.shadowColor = superBoostActive ? "#facc15" : boostActive ? "#fb923c" : color;
  ctx.shadowBlur = superBoostActive ? 42 : boostActive ? 26 : 10;
  ctx.beginPath();
  ctx.moveTo(rearX, laneCenter - flameHeight * 0.45);
  ctx.lineTo(rearX - trailLength, laneCenter - flameHeight + boostPulse);
  ctx.lineTo(rearX - trailLength * 0.72, laneCenter);
  ctx.lineTo(rearX - trailLength, laneCenter + flameHeight - boostPulse);
  ctx.lineTo(rearX, laneCenter + flameHeight * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function raceCarDimensions(racer, laneHeight, scale) {
  const carDef = carDefFor(racer);
  const carImage = loadedCarImage(carDef);
  if (carImage) {
    const height = Math.max(24, Math.min(52, laneHeight * 0.9)) * scale;
    return {
      width: height * (carImage.naturalWidth / carImage.naturalHeight) * (carDef.photoScale ?? 1),
      height,
      image: carImage,
    };
  }

  return {
    width: Math.max(34, Math.min(68, laneHeight * 1.05)) * carDef.width * scale,
    height: Math.max(12, Math.min(24, laneHeight * 0.36)) * carDef.height * scale,
    image: null,
  };
}

function drawCar(ctx, x, y, laneHeight, color, scale, racer, boostActive, carBox = raceCarDimensions(racer, laneHeight, scale)) {
  const carDef = carDefFor(racer);
  const carImage = carBox.image ?? loadedCarImage(carDef);
  if (carImage) {
    drawCarPhoto(ctx, x, y, laneHeight, color, racer, boostActive, carImage, carDef, carBox);
    return;
  }

  const carWidth = carBox.width;
  const carHeight = carBox.height;
  const wheelRadius = Math.max(3.4, carHeight * 0.27);
  const bodyX = x - carWidth / 2;
  const bodyY = y - carHeight / 2;
  const bodyRadius = Math.max(2.5, carHeight * carDef.roundness);
  const roofWidth = carWidth * carDef.roofWidth;
  const roofHeight = carHeight * carDef.roofHeight;
  const roofX = bodyX + carWidth * carDef.roofX;
  const roofY = bodyY - roofHeight * 0.82;
  const frontWheelX = bodyX + carWidth * (1 - (1 - carDef.wheelBase) / 2 - 0.08);
  const rearWheelX = bodyX + carWidth * ((1 - carDef.wheelBase) / 2 + 0.06);
  const wheelY = bodyY + carHeight + Math.max(0.5, laneHeight * 0.01);

  ctx.save();
  ctx.shadowColor = boostActive ? "#fdba74" : color;
  ctx.shadowBlur = boostActive ? 26 : 15;
  ctx.fillStyle = color;
  drawVehicleBody(ctx, bodyX, bodyY, carWidth, carHeight, bodyRadius, carDef);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  roundedRect(ctx, roofX, roofY, roofWidth, roofHeight, carDef.stance === "boxy" ? 2.5 : 6);
  ctx.fill();

  ctx.fillStyle = "rgba(186,230,253,0.28)";
  roundedRect(ctx, roofX + roofWidth * 0.12, roofY + roofHeight * 0.18, roofWidth * 0.32, roofHeight * 0.55, 2);
  ctx.fill();
  roundedRect(ctx, roofX + roofWidth * 0.52, roofY + roofHeight * 0.18, roofWidth * 0.32, roofHeight * 0.55, 2);
  ctx.fill();

  ctx.fillStyle = "rgba(248,250,252,0.88)";
  ctx.fillRect(bodyX + carWidth - 4, y - carHeight * 0.24, 5, Math.max(2, carHeight * 0.17));
  ctx.fillRect(bodyX + carWidth - 4, y + carHeight * 0.07, 5, Math.max(2, carHeight * 0.17));

  ctx.fillStyle = "rgba(2, 6, 23, 0.96)";
  ctx.beginPath();
  ctx.arc(rearWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.arc(frontWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(148,163,184,0.72)";
  ctx.lineWidth = Math.max(1, wheelRadius * 0.28);
  ctx.beginPath();
  ctx.arc(rearWheelX, wheelY, wheelRadius * 0.55, 0, Math.PI * 2);
  ctx.arc(frontWheelX, wheelY, wheelRadius * 0.55, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(226,232,240,0.9)";
  ctx.font = `900 ${Math.max(7, carHeight * 0.32)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(racer.carNo), bodyX + carWidth * 0.26, y);

  ctx.restore();
  ctx.textAlign = "start";
}

function drawCarPhoto(ctx, x, y, laneHeight, color, racer, boostActive, image, carDef, carBox) {
  const drawHeight = carBox.height;
  const drawWidth = carBox.width;
  const drawX = x - drawWidth / 2;
  const drawY = y - drawHeight / 2;
  const flipX = carDef.flipInRace === true;

  ctx.save();
  ctx.shadowColor = boostActive ? "#fdba74" : color;
  ctx.shadowBlur = boostActive ? 28 : 13;
  drawCarImage(ctx, image, drawX, drawY, drawWidth, drawHeight, flipX);
  ctx.restore();

  const badgeHeight = Math.max(12, Math.min(18, laneHeight * 0.28));
  const badgeWidth = badgeHeight * 1.72;
  const badgeX = drawX + drawWidth * 0.6;
  const badgeY = y - drawHeight * 0.34;

  ctx.save();
  ctx.fillStyle = "rgba(2, 6, 23, 0.7)";
  roundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = `900 ${Math.max(8, badgeHeight * 0.58)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(racer.carNo), badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
  ctx.restore();
  ctx.textAlign = "start";
}

function drawCarImage(ctx, img, x, y, width, height, flipX) {
  ctx.save();
  if (flipX) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.drawImage(img, x, y, width, height);
  }
  ctx.restore();
}

function drawVehicleBody(ctx, x, y, width, height, radius, carDef) {
  const hoodY = carDef.stance === "sharp" || carDef.stance === "low" ? y + height * 0.18 : y + height * 0.08;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width * 0.22, hoodY);
  ctx.lineTo(x + width - radius, y + height * 0.08);
  ctx.quadraticCurveTo(x + width, y + height * 0.08, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStartLine(ctx, x, y, height) {
  ctx.fillStyle = "rgba(34,197,94,0.95)";
  ctx.fillRect(x - 4, y, 8, height);
  ctx.fillStyle = "rgba(187,247,208,0.9)";
  ctx.font = "800 11px system-ui";
  ctx.save();
  ctx.translate(x - 14, y + height / 2 + 22);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("START", 0, 0);
  ctx.restore();
}

function drawFinishLine(ctx, x, y, height) {
  const cell = Math.max(6, Math.min(12, height / 18));
  for (let row = 0; row < Math.ceil(height / cell); row += 1) {
    for (let col = 0; col < 3; col += 1) {
      ctx.fillStyle = (row + col) % 2 === 0 ? "#f8fafc" : "#020617";
      ctx.fillRect(x - 8 + col * cell, y + row * cell, cell, cell);
    }
  }
  ctx.strokeStyle = "rgba(248,250,252,0.95)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 8, y, cell * 3, height);
  ctx.fillStyle = "rgba(248,250,252,0.92)";
  ctx.font = "800 11px system-ui";
  ctx.save();
  ctx.translate(x + cell * 3 + 10, y + height / 2 + 22);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("FINISH", 0, 0);
  ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }

  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
}

function trimCanvasText(value, maxLength) {
  const text = String(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(1, maxLength - 1))}…`;
}

function renderResult() {
  const race = state.race;
  const ranking = race?.ranking ?? [];
  const winner = ranking.find((racer) => racer.id === race?.winnerId);
  const buyer = ranking.find((racer) => racer.id === race?.drinkBuyerId);

  app.innerHTML = html`
    <main class="page-layout result-layout">
      <header class="top-bar">
        <button class="icon-button" data-action="home" aria-label="홈으로">←</button>
        <div>
          <p class="eyebrow">Result</p>
          <h1>레이스 결과</h1>
        </div>
        <button class="ghost-button compact" data-action="again">다시 하기</button>
      </header>

      <section class="result-hero">
        <div>
          <span>우승 자동차</span>
          <strong>${winner ? `${carHash(winner)} ${escapeHtml(carDisplayName(winner))}` : "-"}</strong>
        </div>
        <div class="buyer">
          <span>오늘의 음료수 담당</span>
          <strong>${buyer ? `${carHash(buyer)} ${escapeHtml(carDisplayName(buyer))}` : "-"}</strong>
        </div>
      </section>

      <section class="ranking-list">
        ${ranking
          .map(
            (racer) => html`
              <article class="ranking-row ${racer.id === race?.drinkBuyerId ? "buyer-row" : ""}" style="--player-color: ${colorFor(racer)}">
                <span class="rank">${carHash(racer)}</span>
                <strong>${escapeHtml(carDisplayName(racer))}</strong>
                <span>${racer.finishTime?.toFixed(2) ?? "--"}s</span>
                <em>${racer.id === race?.drinkBuyerId ? "음료수 담당" : racer.id === race?.winnerId ? "우승" : "완주"}</em>
              </article>
            `,
          )
          .join("")}
      </section>
    </main>
  `;

  app.querySelector("[data-action='home']").addEventListener("click", () => setScreen("home"));
  app.querySelector("[data-action='again']").addEventListener("click", () => {
    prepareRace();
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

window.addEventListener("resize", () => {
  if (state.screen === "race") {
    drawRaceCanvas();
  }
});

window.addEventListener("orientationchange", () => {
  window.setTimeout(() => {
    if (state.screen === "race") {
      drawRaceCanvas();
    }
  }, 120);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelRaceLoop();
  if (!document.hidden && state.screen === "race" && state.race?.status === "running") requestRaceFrame();
});

preloadCarImages();
render();
