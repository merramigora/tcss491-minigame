const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameStarted = false;
let gameOver = false;

let score = 0;
const winScore = 5;

const player = {
x: 250,
y: 200,
size: 20,
speed: 4
};

const enemy = {
x: 100,
y: 100,
size: 20,
speed: 2
};

let coin = spawnCoin();

const keys = {};

document.addEventListener("keydown", (e)=>{

keys[e.key]=true;

if(e.key==="Enter"){
gameStarted=true;
}

if(e.key==="r"){
restartGame();
}

});

document.addEventListener("keyup",(e)=>{
keys[e.key]=false;
});

function spawnCoin(){

return{
x:Math.random()*460,
y:Math.random()*360,
size:12
};

}

function update(){

if(!gameStarted || gameOver) return;

if(keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
if(keys["ArrowDown"] || keys["s"]) player.y += player.speed;
if(keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
if(keys["ArrowRight"] || keys["d"]) player.x += player.speed;

enemy.x += (player.x-enemy.x)*0.01;
enemy.y += (player.y-enemy.y)*0.01;

if(checkCollision(player,coin)){
score++;
coin = spawnCoin();
}

if(checkCollision(player,enemy)){
gameOver=true;
}

if(score>=winScore){
gameOver=true;
}

}

function checkCollision(a,b){

return(
a.x < b.x + b.size &&
a.x + a.size > b.x &&
a.y < b.y + b.size &&
a.y + a.size > b.y
);

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="yellow";
ctx.beginPath();
ctx.arc(coin.x,coin.y,coin.size,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="green";
ctx.fillRect(player.x,player.y,player.size,player.size);

ctx.fillStyle="red";
ctx.fillRect(enemy.x,enemy.y,enemy.size,enemy.size);

ctx.fillStyle="white";
ctx.font="16px Arial";
ctx.fillText("Score: "+score,10,20);

if(!gameStarted){
ctx.fillText("Press ENTER to start",160,200);
}

if(gameOver){

if(score>=winScore){
ctx.fillText("You Win!",210,200);
}else{
ctx.fillText("Game Over",210,200);
}

}

}

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

function restartGame(){

player.x=250;
player.y=200;

enemy.x=100;
enemy.y=100;

score=0;

coin=spawnCoin();

gameOver=false;
gameStarted=false;

}

gameLoop();
