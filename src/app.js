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
    slot: index + 1,
    name: `${index + 1}번 레이서`,
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
  return PLAYER_COLORS[player.slot - 1] ?? "#94a3b8";
}

function randomName(slot) {
  const left = NICKNAME_PARTS[(slot + Math.floor(Math.random() * NICKNAME_PARTS.length)) % NICKNAME_PARTS.length];
  const right = NICKNAME_ENDINGS[Math.floor(Math.random() * NICKNAME_ENDINGS.length)];
  return `${left} ${right}`;
}

function setScreen(screen) {
  state.screen = screen;
  cancelRaceLoop();
  render();
}

function resetSelections() {
  state.players.forEach((player) => {
    player.selectedOrder = null;
  });
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
  player.name = randomName(player.slot);
  render();
}

function rerollVisibleNames() {
  visiblePlayers().forEach((player) => {
    player.name = randomName(player.slot);
  });
  render();
}

function prepareRace() {
  const racers = selectedPlayers().map((player, index) => ({
    ...player,
    lane: index,
    reactionMs: Math.round(180 + Math.random() * 620),
    acceleration: 0.0000019 + Math.random() * 0.0000012,
    maxSpeed: 0.00062 + Math.random() * 0.00018,
    nitroAt: 0.38 + Math.random() * 0.28,
    nitroUsed: false,
    progress: 0,
    speed: 0,
    finishTime: null,
    finished: false,
  }));

  state.race = {
    status: "ready",
    startedAt: null,
    countdownStartedAt: null,
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

function startRaceNow() {
  if (!state.race) return;
  state.race.status = "running";
  state.race.startedAt = performance.now();
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
    drawRaceCanvas();
    renderRaceHud();
    if (elapsed >= 3000) {
      startRaceNow();
      return;
    }
    animationFrameId = requestAnimationFrame(tickRace);
    return;
  }

  if (race.status !== "running" || race.startedAt === null) return;

  const elapsed = now - race.startedAt;
  const allFinished = race.racers.every((racer) => racer.finished);

  race.racers.forEach((racer) => {
    if (racer.finished) return;

    if (elapsed < racer.reactionMs) {
      racer.speed = 0;
      return;
    }

    const racingMs = elapsed - racer.reactionMs;
    const gripPulse = 0.00000022 * Math.sin((elapsed + racer.slot * 190) / 180);
    const nitro = !racer.nitroUsed && racer.progress >= racer.nitroAt ? 0.0003 : 0;
    racer.nitroUsed = racer.nitroUsed || nitro > 0;
    racer.speed = Math.min(racer.maxSpeed + nitro, racer.speed + racer.acceleration * racingMs + gripPulse);
    racer.progress = Math.min(1, racer.progress + racer.speed * 16.7);

    if (racer.progress >= 1) {
      racer.finished = true;
      racer.finishTime = elapsed / 1000;
      race.ranking = [...race.ranking, racer];
    }
  });

  drawRaceCanvas();
  renderRaceHud();

  if (allFinished || elapsed > 16000) {
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
        <p class="hero-copy">로비에서 참가자를 고르고, 짧은 드래그 레이스로 오늘 음료수 담당을 정합니다.</p>
        <div class="button-row">
          <button class="primary-button" data-action="go-lobby">로비 만들기</button>
          <button class="ghost-button" data-action="quick-start">6명 빠른 시작</button>
        </div>
      </section>
      <section class="feature-strip" aria-label="게임 흐름">
        <div><strong>1</strong><span>참가자 선택</span></div>
        <div><strong>2</strong><span>런치 대기</span></div>
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
    <main class="page-layout">
      <header class="top-bar">
        <button class="icon-button" data-action="home" aria-label="홈으로">←</button>
        <div>
          <p class="eyebrow">Mock Lobby</p>
          <h1>참가자 선택</h1>
        </div>
        <button class="ghost-button compact" data-action="random-all">이름 다시 뽑기</button>
      </header>

      <section class="lobby-controls" aria-label="로비 설정">
        <div class="segmented-control" role="group" aria-label="참가자 수">
          ${[2, 4, 6, 8, 10]
            .map(
              (count) => html`
                <button class="${state.playerCount === count ? "active" : ""}" data-count="${count}">
                  ${count}명
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="selection-summary">
          <strong>${selected.length}</strong>
          <span>명 선택됨</span>
        </div>
      </section>

      <section class="player-grid" aria-label="참가자 목록">
        ${visiblePlayers().map(renderPlayerCard).join("")}
      </section>

      <footer class="bottom-action">
        <div>
          <strong>선택 순서</strong>
          <span>${selected.length > 0 ? selected.map((player) => `${player.selectedOrder}. ${player.name}`).join(" · ") : "카드를 눌러 참가자를 선택하세요"}</span>
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
  return html`
    <article class="player-card ${selected ? "selected" : ""}" data-player-card="${player.id}" style="--player-color: ${colorFor(player)}">
      <div class="player-card-header">
        <span class="slot-badge">${player.slot}</span>
        <span class="selection-badge">${selected ? `${player.selectedOrder}번 선택` : "대기"}</span>
      </div>
      <div class="car-preview" aria-hidden="true">
        <span class="car-body"></span>
        <span class="car-wheel front"></span>
        <span class="car-wheel rear"></span>
      </div>
      <label>
        <span>닉네임</span>
        <input data-player-name="${player.id}" value="${escapeAttribute(player.name)}" maxlength="16" />
      </label>
      <button class="ghost-button compact" data-reroll="${player.id}">랜덤</button>
    </article>
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
          <h1>출발선 정렬</h1>
        </div>
        <button class="ghost-button compact" data-action="reshuffle">레이스 다시 섞기</button>
      </header>

      <section class="launch-grid">
        ${racers
          .map(
            (racer) => html`
              <article class="lane-card" style="--player-color: ${colorFor(racer)}">
                <span>${racer.selectedOrder}번 그리드</span>
                <strong>${racer.name}</strong>
                <small>반응속도 예상 ${racer.reactionMs || Math.round(200 + Math.random() * 500)}ms</small>
              </article>
            `,
          )
          .join("")}
      </section>

      <section class="start-panel">
        <p>선택된 순서대로 레인이 배정됩니다. 마지막으로 들어오는 사람이 오늘 음료수 담당입니다.</p>
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
          <h1>400m 드래그 레이스</h1>
        </div>
        <button class="ghost-button compact" data-action="abort">로비로</button>
      </header>
      <section class="race-stage">
        <canvas id="raceCanvas" width="1280" height="720" aria-label="드래그 레이싱 트랙"></canvas>
        <div id="countdown" class="countdown"></div>
      </section>
      <aside id="raceHud" class="race-hud" aria-label="레이스 현황"></aside>
    </main>
  `;

  app.querySelector("[data-action='abort']").addEventListener("click", () => setScreen("lobby"));
  drawRaceCanvas();
  renderRaceHud();

  if (race?.status === "countdown" || race?.status === "running") {
    requestRaceFrame();
  }
}

function renderRaceHud() {
  const hud = document.querySelector("#raceHud");
  if (!hud || !state.race) return;

  const racers = [...state.race.racers].sort((a, b) => {
    if (a.finished !== b.finished) return Number(b.finished) - Number(a.finished);
    return b.progress - a.progress;
  });

  hud.innerHTML = racers
    .map(
      (racer, index) => html`
        <div class="hud-row" style="--player-color: ${colorFor(racer)}">
          <span class="rank">${index + 1}</span>
          <strong>${escapeHtml(racer.name)}</strong>
          <div class="hud-progress"><span style="width: ${Math.round(racer.progress * 100)}%"></span></div>
          <small>${racer.finishTime ? `${racer.finishTime.toFixed(2)}s` : `${Math.round(racer.progress * 400)}m`}</small>
        </div>
      `,
    )
    .join("");
}

function drawRaceCanvas() {
  const canvas = document.querySelector("#raceCanvas");
  const countdown = document.querySelector("#countdown");
  if (!canvas || !state.race) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const racers = state.race.racers;
  const laneHeight = Math.min(84, (height - 140) / racers.length);
  const top = (height - laneHeight * racers.length) / 2 + 34;
  const startX = 120;
  const finishX = width - 122;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#121826";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1f2937");
  gradient.addColorStop(0.52, "#111827");
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fillRect(36, 42, width - 72, height - 84);

  ctx.fillStyle = "rgba(248, 250, 252, 0.88)";
  ctx.font = "700 30px system-ui";
  ctx.fillText("DRAG STRIP 400m", 70, 78);
  ctx.font = "600 18px system-ui";
  ctx.fillText("오늘의 음료수 담당은 결승선을 가장 늦게 통과한 사람", 70, 108);

  racers.forEach((racer, index) => {
    const y = top + index * laneHeight;
    drawLane(ctx, racer, index, y, laneHeight, startX, finishX);
  });

  drawStartFinish(ctx, startX, top - 20, laneHeight * racers.length + 36, "START");
  drawStartFinish(ctx, finishX, top - 20, laneHeight * racers.length + 36, "FINISH");

  if (countdown && state.race.status === "countdown") {
    const elapsed = performance.now() - state.race.countdownStartedAt;
    const left = Math.max(0, 3 - Math.floor(elapsed / 1000));
    countdown.textContent = left > 0 ? String(left) : "GO";
  } else if (countdown) {
    countdown.textContent = "";
  }
}

function drawLane(ctx, racer, index, y, laneHeight, startX, finishX) {
  const laneCenter = y + laneHeight / 2;
  const color = colorFor(racer);
  const carX = startX + (finishX - startX) * racer.progress;

  ctx.fillStyle = index % 2 === 0 ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.075)";
  ctx.fillRect(58, y, 1164, laneHeight - 4);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.setLineDash([18, 18]);
  ctx.beginPath();
  ctx.moveTo(70, y + laneHeight - 4);
  ctx.lineTo(1210, y + laneHeight - 4);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(226,232,240,0.85)";
  ctx.font = "700 18px system-ui";
  ctx.fillText(`${racer.selectedOrder}`, 74, laneCenter + 7);

  ctx.fillStyle = "rgba(226,232,240,0.62)";
  ctx.font = "600 15px system-ui";
  ctx.fillText(racer.name, 104, laneCenter + 6);

  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(carX - 38, laneCenter - 16, 76, 30, 8);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(15,23,42,0.9)";
  ctx.beginPath();
  ctx.roundRect(carX - 10, laneCenter - 27, 32, 20, 7);
  ctx.fill();

  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.arc(carX - 22, laneCenter + 16, 8, 0, Math.PI * 2);
  ctx.arc(carX + 24, laneCenter + 16, 8, 0, Math.PI * 2);
  ctx.fill();

  if (racer.speed > 0 && !racer.finished) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(carX - 44, laneCenter);
    ctx.lineTo(carX - 80 - racer.speed * 48000, laneCenter);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawStartFinish(ctx, x, y, height, label) {
  ctx.fillStyle = "rgba(248,250,252,0.92)";
  ctx.fillRect(x - 5, y, 10, height);
  ctx.fillStyle = "#111827";
  ctx.font = "800 13px system-ui";
  ctx.save();
  ctx.translate(x + 18, y + height / 2 + 28);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(label, 0, 0);
  ctx.restore();
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
          <span>우승</span>
          <strong>${winner ? escapeHtml(winner.name) : "-"}</strong>
        </div>
        <div class="buyer">
          <span>오늘의 음료수 담당</span>
          <strong>${buyer ? escapeHtml(buyer.name) : "-"}</strong>
        </div>
      </section>

      <section class="ranking-list">
        ${ranking
          .map(
            (racer, index) => html`
              <article class="ranking-row ${racer.id === race?.drinkBuyerId ? "buyer-row" : ""}" style="--player-color: ${colorFor(racer)}">
                <span class="rank">${index + 1}</span>
                <strong>${escapeHtml(racer.name)}</strong>
                <span>${racer.selectedOrder}번 선택</span>
                <span>${racer.finishTime?.toFixed(2) ?? "--"}s</span>
                <em>${racer.id === race?.drinkBuyerId ? "음료수 담당" : racer.id === race?.winnerId ? "우승" : ""}</em>
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

document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelRaceLoop();
  if (!document.hidden && state.screen === "race" && state.race?.status === "running") requestRaceFrame();
});

render();
