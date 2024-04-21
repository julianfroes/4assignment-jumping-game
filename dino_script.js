// initialize variables for time tracking and deltaTime
let time = new Date();
let deltaTime = 0;

// Check if the document is fully loaded, then call initialize function
if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(initialize, 1);
}else{
    document.addEventListener("DOMContentLoaded", initialize); 
}

// Function to initialize the game
function initialize() {
    time = new Date(); // Reset time
    Start(); // Start the game
    loop(); // Start the game loop
}

// Main game loop
function loop() {
    // Calculate deltaTime for smooth movement
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    // Update game logic
    update();
    // Call loop recursively using requestAnimationFrame for smooth animation
    requestAnimationFrame(loop);
}

//****** GAME LOGIC ********//

// Define variables for game elements and parameters
const floorY = 22;
let velY = 0;
const jumpHeight = 900;
const gravity = 2500;

let dinoPosX = 42;
let dinoPosY = floorY; 

let floorX = 0;
const scenarioSpeed = 1280/3;
let gameVel = 1;
let score = 0;

let playerStand = false;
let playerJumping = false;

let obstacleTimeUntil = 2;
const obstacleTimeMin = 0.7;
const obstacleTimeMax = 1.8;
const obstacles = [];

let container;
let dino;
let scoreText;
let ground;
let gameOver;
let restartButton;

// Function to start the game
function start() {
    gameOver = document.querySelector(".game-over");
    restartButton = document.getElementById('restart-button');
    ground = document.querySelector(".floor");
    container = document.querySelector(".container");
    scoreText = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.getElementById('start-text').style.display = 'none';
    restartButton.classList.add('hidden');
    document.addEventListener("keydown", handleKeyDown); // Event listener for key presses
}

// Function to update game logic
function update() {
    if(playerStand) return; // If game over, stop updating

    moveDinosaur();
    moveGround();
    decideCreateObstacles();
    moveObstacles();
    detectCollision();

    velY -= gravity * deltaTime; // Apply gravity to the dinosaur
}

// Function to handle key presses (spacebar for jumping)
function handleKeyDown(ev){
    if(ev.keyCode == 32){
        jump();
    }
}

// Function to make the dinosaur jump
function jump(){
    if(dinoPosY === floorY){
        playerJumping = true;
        velY = jumpHeight;
        dino.classList.remove("dino-running");
    }
}

// Function to move the dinosaur vertically
function moveDinosaur() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < floorY){
        touchGround();
    }
    dino.style.bottom = dinoPosY+"px";
}

// Function to handle when the dinosaur touches the ground
function touchGround() {
    dinoPosY = floorY;
    velY = 0;
    if(playerJumping){
        dino.classList.add("dino-running");
    }
    playerJumping = false;
}

// Function to move the ground horizontally to simulate movement
function moveGround() {
    floorX += calculateMovement();
    ground.style.left = -(floorX % container.clientWidth) + "px";
}

// Function to calculate horizontal movement based on scenario speed and game velocity
function calculateMovement() {
    return scenarioSpeed * deltaTime * gameVel;
}

// Function to handle when the dinosaur crashes
function crash() {
    dino.classList.remove("dino-running");
    dino.classList.add("dino-crashed");
    playerStand = true;
}

// Function to decide when to create obstacles
function decideCreateObstacles() {
    obstacleTimeUntil -= deltaTime;
    if(obstacleTimeUntil <= 0) {
        createObstacle();
    }
}

// Function to create a new obstacle
function createObstacle() {
    const obstacle = document.createElement("div");
    container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    if(Math.random() > 0.5) obstacle.classList.add("cactus2");
    obstacle.posX = container.clientWidth;
    obstacle.style.left = container.clientWidth+"px";

    obstacles.push(obstacle);
    obstacleTimeUntil = obstacleTimeMin + Math.random() * (obstacleTimeMax-obstacleTimeMin) / gameVel;
}

// Function to move obstacles horizontally
function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            gainPoints();
        }else{
            obstacles[i].posX -= calculateMovement();
            obstacles[i].style.left = obstacles[i].posX+"px";
        }
    }
}

// Function to increase score and adjust game velocity
function gainPoints() {
    score++;
    scoreText.innerText = score;
    if(score == 5){
        gameVel = 1.5;
    }else if(score == 10) {
        gameVel = 2;
    } else if(score == 20) {
        gameVel = 3;
    }
    ground.style.animationDuration = (3/gameVel)+"s";
}

// Function to handle game over
function gameOverFunction() {
    crash();
    gameOver.style.display = "block";
    restartButton.classList.remove('hidden');
}

// Function to detect collisions between the dinosaur and obstacles
function detectCollision() {
    for (const obstacle of obstacles) {
        if (obstacle.posX > dinoPosX + dino.clientWidth) {
            //EVADING
            break;
        } else {
            if (IsCollision(dino, obstacle, 10, 30, 15, 20)) {
                gameOverFunction();
            }
        }
    }
}

// Function to check collision between two elements
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}


// Function to initialize the game
function initialize() {
    time = new Date(); // Reset time
    document.addEventListener("keydown", handleGameStart); // Event listener for game start
}

// Function to handle game start
function handleGameStart(ev) {
    if (ev.keyCode === 32) { // Spacebar
        document.removeEventListener("keydown", handleGameStart); // Remove event listener
        start(); // Start the game
        loop(); // Start the game loop
    }
}

function restartGame() {
    gameOver.style.display = "none";
    restartButton.classList.add('hidden');
    playerStand = false;
    dino.classList.remove("dino-crashed");
    dino.classList.add("dino-running");
    score = 0;
    scoreText.innerText = "0";
    obstacles.forEach(obstacle => obstacle.parentNode.removeChild(obstacle));
    obstacles.length = 0;
    gameVel = 1;
    ground.style.animationDuration = "3s"
    start();
}