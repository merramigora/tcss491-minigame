const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "start";
let score = 0;
const WIN_SCORE = 5;

const keys = Object.create(null);

window.addEventListener("keydown", (e) => {

  keys[e.key] = true;

  if (e.key === "Enter" && gameState === "start") {
    gameState = "playing";
  }

  if (e.key === "r" || e.key === "R") {
    restartGame();
  }

});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

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
  vx: 3,
  vy: 2
};

let coin = spawnCoin();

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
    x: randInt(20, canvas.width - 40),
    y: randInt(20, canvas.height - 40),
    w: size,
    h: size
  };

}

function restartGame() {

  score = 0;
  gameState = "start";

  player.x = 220;
  player.y = 180;

  enemy.x = 60;
  enemy.y = 60;

  enemy.vx = 3;
  enemy.vy = 2;

  coin = spawnCoin();

}

function update() {

  if (gameState !== "playing") return;

  let dx = 0;
  let dy = 0;

  if (keys["ArrowUp"] || keys["w"] || keys["W"]) dy -= 1;
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) dy += 1;
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dx -= 1;
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx += 1;

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

  enemy.x += enemy.vx;
  enemy.y += enemy.vy;

  if (enemy.x <= 0 || enemy.x + enemy.w >= canvas.width) enemy.vx *= -1;
  if (enemy.y <= 0 || enemy.y + enemy.h >= canvas.height) enemy.vy *= -1;

  if (rectsOverlap(player, enemy)) {
    gameState = "lost";
  }

  if (rectsOverlap(player, coin)) {

    score++;
    coin = spawnCoin();

    enemy.vx += enemy.vx > 0 ? 0.2 : -0.2;
    enemy.vy += enemy.vy > 0 ? 0.2 : -0.2;

    if (score >= WIN_SCORE) {
      gameState = "won";
    }

  }

}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "16px Arial";
  ctx.fillStyle = "#111";
  ctx.fillText(`Score: ${score} / ${WIN_SCORE}`, 10, 20);

  ctx.fillStyle = "gold";
  ctx.fillRect(coin.x, coin.y, coin.w, coin.h);

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  if (gameState === "start") {
    overlayMessage("COIN CHASE\nPress ENTER to Start");
  }

  if (gameState === "won") {
    overlayMessage("YOU WIN!\nPress R to Restart");
  }

  if (gameState === "lost") {
    overlayMessage("GAME OVER\nPress R to Restart");
  }

}

function overlayMessage(msg) {

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "26px Arial";
  ctx.textAlign = "center";

  const lines = msg.split("\n");

  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, canvas.height / 2 + i * 30);
  });

  ctx.textAlign = "left";

}

function gameLoop() {

  update();
  draw();
  requestAnimationFrame(gameLoop);

}

gameLoop();
