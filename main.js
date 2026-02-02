const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ---------- GAME STATE ----------
let gameState = "playing"; // "playing" | "won" | "lost"
let score = 0;
const WIN_SCORE = 5;

// ---------- INPUT ----------
const keys = Object.create(null);

// IMPORTANT: prevent arrow keys from scrolling the page
window.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key] = true;

  if (e.key === "r" || e.key === "R") restartGame();
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ---------- OBJECTS ----------
const player = {
  x: 220,
  y: 180,
  w: 26,
  h: 26,
  speed: 4
};

const enemy = {
  x: 60,
  y: 60,
  w: 28,
  h: 28,
  vx: 3,   // moves left/right
  vy: 2    // moves up/down
};

let coin = spawnCoin();

// ---------- HELPERS ----------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function spawnCoin() {
  const size = 16;
  return {
    x: randInt(20, canvas.width - 20 - size),
    y: randInt(20, canvas.height - 20 - size),
    w: size,
    h: size
  };
}

function restartGame() {
  score = 0;
  gameState = "playing";

  player.x = 220;
  player.y = 180;

  enemy.x = 60;
  enemy.y = 60;
  enemy.vx = 3;
  enemy.vy = 2;

  coin = spawnCoin();
}

// ---------- GAME LOOP ----------
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (gameState !== "playing") return;

  // Player movement (Arrow keys + WASD)
  let dx = 0, dy = 0;
  if (keys["ArrowUp"] || keys["w"] || keys["W"]) dy -= 1;
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) dy += 1;
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dx -= 1;
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx += 1;

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  // Keep player inside canvas
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

  // Enemy movement (bounces)
  enemy.x += enemy.vx;
  enemy.y += enemy.vy;

  if (enemy.x <= 0 || enemy.x + enemy.w >= canvas.width) enemy.vx *= -1;
  if (enemy.y <= 0 || enemy.y + enemy.h >= canvas.height) enemy.vy *= -1;

  // Collision: player hits enemy => lose
  if (rectsOverlap(player, enemy)) {
    gameState = "lost";
  }

  // Collision: player gets coin => score
  if (rectsOverlap(player, coin)) {
    score++;
    coin = spawnCoin();

    // slightly increase difficulty over time
    enemy.vx += enemy.vx > 0 ? 0.2 : -0.2;
    enemy.vy += enemy.vy > 0 ? 0.2 : -0.2;

    if (score >= WIN_SCORE) {
      gameState = "won";
    }
  }
}

function draw() {
  // Background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // HUD
  ctx.font = "16px Arial";
  ctx.fillStyle = "#111";
  ctx.fillText(`Score: ${score} / ${WIN_SCORE}`, 10, 22);
  ctx.fillText(`Avoid the red enemy. Collect the gold coin. Press R to restart.`, 10, 42);

  // Coin
  ctx.fillStyle = "#f4c542";
  ctx.fillRect(coin.x, coin.y, coin.w, coin.h);

  // Enemy
  ctx.fillStyle = "#e53935";
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  // Player
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // End screens
  if (gameState === "won") {
    overlayMessage("YOU WIN! 🎉 Press R to play again");
  } else if (gameState === "lost") {
    overlayMessage("GAME OVER 💀 Press R to try again");
  }
}

function overlayMessage(msg) {
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "26px Arial";
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "left";
}

// Start
gameLoop();
