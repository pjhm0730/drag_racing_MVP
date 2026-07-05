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
    id: "mid-suv",
    label: "SUV",
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
    id: "sedan",
    label: "Sedan",
    width: 1.1,
    height: 0.82,
    roofX: 0.42,
    roofWidth: 0.34,
    roofHeight: 0.38,
    wheelBase: 0.66,
    roundness: 0.18,
    stance: "low",
  },
  {
    id: "large-sedan",
    label: "Large Sedan",
    width: 1.2,
    height: 0.9,
    roofX: 0.43,
    roofWidth: 0.4,
    roofHeight: 0.4,
    wheelBase: 0.7,
    roundness: 0.2,
    stance: "long",
  },
  {
    id: "compact-suv",
    label: "Compact SUV",
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
    id: "compact",
    label: "Compact",
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
    id: "sports-sedan",
    label: "Sports Sedan",
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
    id: "luxury-sedan",
    label: "Luxury Sedan",
    width: 1.18,
    height: 0.86,
    roofX: 0.42,
    roofWidth: 0.38,
    roofHeight: 0.38,
    wheelBase: 0.69,
    roundness: 0.24,
    stance: "long",
  },
  {
    id: "coupe",
    label: "Coupe",
    width: 1.06,
    height: 0.64,
    roofX: 0.48,
    roofWidth: 0.28,
    roofHeight: 0.3,
    wheelBase: 0.64,
    roundness: 0.22,
    stance: "sharp",
  },
  {
    id: "boxy-suv",
    label: "Boxy SUV",
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
    id: "hatchback",
    label: "Hatchback",
    width: 0.9,
    height: 0.86,
    roofX: 0.33,
    roofWidth: 0.46,
    roofHeight: 0.44,
    wheelBase: 0.56,
    roundness: 0.28,
    stance: "round",
  },
];

const NICKNAME_PARTS = [
  "터보",
  "제로백",
  "풀악셀",
  "니트로",
  "레드존",
  "번아웃",
  "피트인",
  "런치",
  "슬립",
  "그립",
];

const NICKNAME_ENDINGS = [
  "김대리",
  "박과장",
  "최차장",
  "정프로",
  "이매니저",
  "한팀장",
  "윤선임",
  "오주임",
  "강책임",
  "서리더",
];

const DEFAULT_STATE = {
  screen: "home",
  playerCount: 6,
  players: Array.from({ length: 10 }, (_, index) => ({
    id: `player-${index + 1}`,
    carNo: index + 1,
    carType: CAR_DEFS[index]?.id ?? CAR_DEFS[0].id,
    name: `${index + 1}번 자동차`,
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

function selectedPlayers() {
  return state.players
    .slice(0, state.playerCount)
    .filter((player) => player.selectedOrder !== null)
    .sort((a, b) => a.selectedOrder - b.selectedOrder);
}

function visiblePlayers() {
  return state.players.slice(0, state.playerCount);
}

function colorFor(player) {
  return PLAYER_COLORS[player.carNo - 1] ?? "#94a3b8";
}

function carHash(player) {
  return `Car #${player.carNo}`;
}

function carDefFor(player) {
  return CAR_DEFS.find((car) => car.id === player.carType) ?? CAR_DEFS[(player.carNo - 1) % CAR_DEFS.length];
}

function randomName(carNo) {
  const left = NICKNAME_PARTS[(carNo + Math.floor(Math.random() * NICKNAME_PARTS.length)) % NICKNAME_PARTS.length];
  const right = NICKNAME_ENDINGS[Math.floor(Math.random() * NICKNAME_ENDINGS.length)];
  return `${left} ${right}`;
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
    player.selectedOrder = selectedPlayers().length + 1;
  } else {
    player.selectedOrder = null;
    normalizeSelectionOrder();
  }

  render();
}

function updatePlayerCount(count) {
  state.playerCount = count;
  state.players.forEach((player, index) => {
    if (index >= count) {
      player.selectedOrder = null;
    }
  });
  normalizeSelectionOrder();
  render();
}

function updatePlayerName(playerId, name) {
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player) return;
  player.name = name.trimStart().slice(0, 16);
}

function rerollPlayerName(playerId) {
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player) return;
  player.name = randomName(player.carNo);
  render();
}

function rerollVisibleNames() {
  visiblePlayers().forEach((player) => {
    player.name = randomName(player.carNo);
  });
  render();
}

function prepareRace() {
  const racers = selectedPlayers().map((player, index) => ({
    ...player,
    lane: index,
    reactionMs: Math.round(150 + Math.random() * 560),
    acceleration: 0.000000016 + Math.random() * 0.000000015,
    maxSpeed: 0.000116 + Math.random() * 0.000037,
    nitroAt: 0.34 + Math.random() * 0.34,
    nitroUsed: false,
    boostStartedAt: null,
    boostEndsAt: null,
    boostLabelUntil: null,
    surgePhase: Math.random() * Math.PI * 2,
    surgeRate: 0.0012 + Math.random() * 0.0009,
    progress: 0,
    speed: 0,
    finishTime: null,
    finished: false,
  }));

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
      racer.boostEndsAt = elapsed + 850 + Math.random() * 560;
      racer.boostLabelUntil = elapsed + 900;
      racer.speed += 0.000045;
    }

    const boostActive = racer.boostEndsAt !== null && elapsed <= racer.boostEndsAt;
    const middleRaceSurge = racer.progress > 0.18 && racer.progress < 0.88;
    const surgeWave = middleRaceSurge ? Math.sin(elapsed * racer.surgeRate + racer.surgePhase) * 0.000012 : 0;
    const tractionNoise = Math.sin(elapsed * 0.0034 + racer.carNo * 1.7) * 0.000004;
    const targetMaxSpeed = racer.maxSpeed + surgeWave + tractionNoise + (boostActive ? 0.000075 : 0);

    racer.speed = Math.min(Math.max(targetMaxSpeed, 0.000076), racer.speed + racer.acceleration * frameMs);
    racer.speed *= boostActive ? 0.999 : 0.994;
    racer.progress = Math.min(1, racer.progress + racer.speed * frameMs);

    if (racer.progress >= 1) {
      racer.finished = true;
      racer.finishTime = elapsed / 1000;
      race.ranking = [...race.ranking, racer];
    }
  });

  drawRaceCanvas(now);

  const allFinished = race.racers.every((racer) => racer.finished);
  if (allFinished || elapsed > 17000) {
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
    visiblePlayers().forEach((player, index) => {
      player.selectedOrder = index + 1;
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
        <button class="ghost-button compact" data-action="random-all">이름 다시 뽑기</button>
      </header>

      <section class="lobby-controls" aria-label="로비 설정">
        <div class="segmented-control" role="group" aria-label="자동차 수">
          ${[2, 4, 6, 8, 10]
            .map(
              (count) => html`
                <button class="${state.playerCount === count ? "active" : ""}" data-count="${count}">
                  ${count}대
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="selection-summary">
          <strong>${selected.length}</strong>
          <span>대 참가</span>
        </div>
      </section>

      <section class="player-grid" aria-label="자동차 목록">
        ${visiblePlayers().map(renderPlayerCard).join("")}
      </section>

      <footer class="bottom-action">
        <div>
          <strong>참가 자동차</strong>
          <span>${selected.length > 0 ? selected.map((player) => `${carHash(player)} ${escapeHtml(player.name)}`).join(" · ") : "카드를 눌러 참가할 자동차를 고르세요"}</span>
        </div>
        <button class="primary-button" data-action="prepare" ${selected.length < 2 ? "disabled" : ""}>
          레이스 준비
        </button>
      </footer>
    </main>
  `;

  app.querySelector("[data-action='home']").addEventListener("click", () => setScreen("home"));
  app.querySelector("[data-action='random-all']").addEventListener("click", rerollVisibleNames);
  app.querySelector("[data-action='prepare']").addEventListener("click", prepareRace);
  app.querySelectorAll("[data-count]").forEach((button) => {
    button.addEventListener("click", () => updatePlayerCount(Number(button.dataset.count)));
  });
  app.querySelectorAll("[data-player-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("input, button")) return;
      togglePlayer(card.dataset.playerCard);
    });
  });
  app.querySelectorAll("[data-player-name]").forEach((input) => {
    input.addEventListener("input", () => updatePlayerName(input.dataset.playerName, input.value));
  });
  app.querySelectorAll("[data-reroll]").forEach((button) => {
    button.addEventListener("click", () => rerollPlayerName(button.dataset.reroll));
  });
}

function renderPlayerCard(player) {
  const selected = player.selectedOrder !== null;
  const carDef = carDefFor(player);
  return html`
    <article class="player-card ${selected ? "selected" : ""}" data-player-card="${player.id}" style="--player-color: ${colorFor(player)}">
      <div class="player-card-header">
        <span class="slot-badge">${carHash(player)}</span>
        <span class="selection-badge">${selected ? "참가" : "대기"}</span>
      </div>
      <svg class="car-preview" viewBox="0 0 160 82" aria-hidden="true">
        ${renderCarSvg(player, carDef)}
      </svg>
      <div class="car-type">${escapeHtml(carDef.label)}</div>
      <label>
        <span>닉네임</span>
        <input data-player-name="${player.id}" value="${escapeAttribute(player.name)}" maxlength="16" />
      </label>
      <button class="ghost-button compact" data-reroll="${player.id}">랜덤</button>
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
                <strong>${escapeHtml(racer.name)}</strong>
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
  drawRaceBackground(ctx, width, height, roadOffset, race.status);

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

function drawRaceBackground(ctx, width, height, offset, status) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#18202d");
  gradient.addColorStop(0.48, "#101722");
  gradient.addColorStop(1, "#050915");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
  ctx.fillRect(18, 28, width - 36, height - 48);

  const gridOffset = offset % 58;
  ctx.strokeStyle = status === "running" ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.06)";
  ctx.lineWidth = 1;
  for (let x = -58 + gridOffset; x < width + 80; x += 58) {
    ctx.beginPath();
    ctx.moveTo(x, 28);
    ctx.lineTo(x - 100, height - 20);
    ctx.stroke();
  }

  const markerOffset = offset % 180;
  for (let x = width + 80 - markerOffset; x > -120; x -= 180) {
    ctx.fillStyle = "rgba(253, 186, 116, 0.22)";
    ctx.fillRect(x, 40, 20, height - 78);
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.beginPath();
    ctx.arc(x + 10, 38, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (status === "running") {
    ctx.strokeStyle = "rgba(248, 250, 252, 0.18)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i += 1) {
      const y = 58 + ((i * 47 + offset * 0.7) % Math.max(80, height - 100));
      const x = width - ((i * 127 + offset * 1.8) % (width + 240));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 90 - (i % 4) * 22, y);
      ctx.stroke();
    }
  }
}

function drawLane(ctx, racer, index, y, laneHeight, startX, finishX, labelWidth, offset, elapsedMs) {
  const laneCenter = y + laneHeight / 2;
  const color = colorFor(racer);
  const laneLeft = Math.max(18, startX - labelWidth);
  const laneRight = finishX + 18;
  const carX = startX + (finishX - startX) * racer.progress;
  const boostActive = racer.boostEndsAt !== null && elapsedMs <= racer.boostEndsAt;
  const boostAge = boostActive ? Math.max(0, elapsedMs - racer.boostStartedAt) : 0;
  const boostPulse = boostActive ? Math.sin(boostAge / 36) * 2.4 : 0;
  const carScale = boostActive ? 1.08 + Math.sin(boostAge / 48) * 0.05 : 1;
  const compactLane = laneHeight < 34;

  ctx.fillStyle = index % 2 === 0 ? "rgba(255,255,255,0.052)" : "rgba(255,255,255,0.082)";
  ctx.fillRect(laneLeft, y + 1, laneRight - laneLeft, laneHeight - 2);

  const stripeOffset = offset % 76;
  ctx.strokeStyle = "rgba(255,255,255,0.26)";
  ctx.setLineDash([24, 24]);
  ctx.lineDashOffset = -stripeOffset;
  ctx.lineWidth = Math.max(1, laneHeight * 0.025);
  ctx.beginPath();
  ctx.moveTo(startX + 14, y + laneHeight - 2);
  ctx.lineTo(finishX - 16, y + laneHeight - 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;

  ctx.fillStyle = "rgba(226,232,240,0.9)";
  ctx.font = `800 ${Math.max(11, Math.min(16, laneHeight * 0.27))}px system-ui`;
  ctx.textBaseline = "middle";
  ctx.fillText(carHash(racer), laneLeft + 10, compactLane ? laneCenter : laneCenter - Math.min(9, laneHeight * 0.12));

  if (!compactLane) {
    ctx.fillStyle = "rgba(226,232,240,0.62)";
    ctx.font = `600 ${Math.max(10, Math.min(14, laneHeight * 0.24))}px system-ui`;
    ctx.fillText(trimCanvasText(racer.name, 13), laneLeft + 10, laneCenter + Math.min(11, laneHeight * 0.22));
  }

  if (racer.speed > 0 && !racer.finished) {
    drawExhaust(ctx, carX, laneCenter, color, racer.speed, boostActive, boostPulse, laneHeight);
  }

  drawCar(ctx, carX + boostPulse, laneCenter, laneHeight, color, carScale, racer, boostActive);

  if (racer.boostLabelUntil !== null && elapsedMs <= racer.boostLabelUntil) {
    const labelAlpha = Math.max(0, (racer.boostLabelUntil - elapsedMs) / 900);
    ctx.save();
    ctx.globalAlpha = labelAlpha;
    ctx.fillStyle = "#fdba74";
    ctx.font = `900 ${Math.max(12, Math.min(22, laneHeight * 0.36))}px system-ui`;
    ctx.fillText("BOOST!", Math.min(finishX - 86, carX + 46), laneCenter - laneHeight * 0.25);
    ctx.restore();
  }
}

function drawExhaust(ctx, carX, laneCenter, color, speed, boostActive, boostPulse, laneHeight) {
  const nozzleOffset = Math.max(18, Math.min(30, laneHeight * 0.42));
  const trailLength = boostActive ? 82 + speed * 430000 : 30 + speed * 170000;
  const flameHeight = boostActive ? Math.max(7, laneHeight * 0.22) : Math.max(3, laneHeight * 0.11);
  const gradient = ctx.createLinearGradient(carX - trailLength, laneCenter, carX - nozzleOffset, laneCenter);
  gradient.addColorStop(0, "rgba(249, 115, 22, 0)");
  gradient.addColorStop(0.3, boostActive ? "rgba(249, 115, 22, 0.35)" : "rgba(148, 163, 184, 0.18)");
  gradient.addColorStop(1, boostActive ? color : "rgba(226,232,240,0.32)");

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.shadowColor = boostActive ? "#fb923c" : color;
  ctx.shadowBlur = boostActive ? 26 : 10;
  ctx.beginPath();
  ctx.moveTo(carX - nozzleOffset, laneCenter - flameHeight * 0.45);
  ctx.lineTo(carX - trailLength, laneCenter - flameHeight + boostPulse);
  ctx.lineTo(carX - trailLength * 0.72, laneCenter);
  ctx.lineTo(carX - trailLength, laneCenter + flameHeight - boostPulse);
  ctx.lineTo(carX - nozzleOffset, laneCenter + flameHeight * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCar(ctx, x, y, laneHeight, color, scale, racer, boostActive) {
  const carDef = carDefFor(racer);
  const carWidth = Math.max(34, Math.min(68, laneHeight * 1.05)) * carDef.width * scale;
  const carHeight = Math.max(12, Math.min(24, laneHeight * 0.36)) * carDef.height * scale;
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
          <strong>${winner ? `${carHash(winner)} ${escapeHtml(winner.name)}` : "-"}</strong>
        </div>
        <div class="buyer">
          <span>오늘의 음료수 담당</span>
          <strong>${buyer ? `${carHash(buyer)} ${escapeHtml(buyer.name)}` : "-"}</strong>
        </div>
      </section>

      <section class="ranking-list">
        ${ranking
          .map(
            (racer) => html`
              <article class="ranking-row ${racer.id === race?.drinkBuyerId ? "buyer-row" : ""}" style="--player-color: ${colorFor(racer)}">
                <span class="rank">${carHash(racer)}</span>
                <strong>${escapeHtml(racer.name)}</strong>
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

render();
