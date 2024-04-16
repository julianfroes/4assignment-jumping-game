// Initialize variables for time tracking and deltaTime
var time = new Date();
var deltaTime = 0;

// Check if the document is fully loaded, then call Initialize function
if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Initialize, 1);
}else{
    document.addEventListener("DOMContentLoaded", Initialize); 
}

// Function to initialize the game
function Initialize() {
    time = new Date(); // Reset time
    Start(); // Start the game
    Loop(); // Start the game loop
}

// Main game loop
function Loop() {
    // Calculate deltaTime for smooth movement
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    // Update game logic
    Update();
    // Call Loop recursively using requestAnimationFrame for smooth animation
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

// Define variables for game elements and parameters
var floorY = 22;
var velY = 0;
var jumpHeight = 900;
var gravity = 2500;

var dinoPosX = 42;
var dinoPosY = floorY; 

var floorX = 0;
var scenarioSpeed = 1280/3;
var gameVel = 1;
var score = 0;

var playerStand = false;
var playerJumping = false;

var obstacleTimeUntil = 2;
var obstacleTimeMin = 0.7;
var obstacleTimeMax = 1.8;
var obstacles = [];

var container;
var dino;
var scoreText;
var ground;
var gameOver;

// Function to start the game
function Start() {
    gameOver = document.querySelector(".game-over");
    ground = document.querySelector(".floor");
    container = document.querySelector(".container");
    scoreText = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown); // Event listener for key presses
}

// Function to update game logic
function Update() {
    if(playerStand) return; // If game over, stop updating

    MoveDinosaur();
    MoveGround();
    DecideCreateObstacles();
    MoveObstacles();
    DetectCollision();

    velY -= gravity * deltaTime; // Apply gravity to the dinosaur
}

// Function to handle key presses (spacebar for jumping)
function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Jump();
    }
}

// Function to make the dinosaur jump
function Jump(){
    if(dinoPosY === floorY){
        playerJumping = true;
        velY = jumpHeight;
        dino.classList.remove("dino-running");
    }
}

// Function to move the dinosaur vertically
function MoveDinosaur() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < floorY){
        TouchGround();
    }
    dino.style.bottom = dinoPosY+"px";
}

// Function to handle when the dinosaur touches the ground
function TouchGround() {
    dinoPosY = floorY;
    velY = 0;
    if(playerJumping){
        dino.classList.add("dino-running");
    }
    playerJumping = false;
}

// Function to move the ground horizontally to simulate movement
function MoveGround() {
    floorX += CalculateMovement();
    ground.style.left = -(floorX % container.clientWidth) + "px";
}

// Function to calculate horizontal movement based on scenario speed and game velocity
function CalculateMovement() {
    return scenarioSpeed * deltaTime * gameVel;
}

// Function to handle when the dinosaur crashes
function Crash() {
    dino.classList.remove("dino-running");
    dino.classList.add("dino-crashed");
    playerStand = true;
}

// Function to decide when to create obstacles
function DecideCreateObstacles() {
    obstacleTimeUntil -= deltaTime;
    if(obstacleTimeUntil <= 0) {
        CreateObstacle();
    }
}

// Function to create a new obstacle
function CreateObstacle() {
    var obstacle = document.createElement("div");
    container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    if(Math.random() > 0.5) obstacle.classList.add("cactus2");
    obstacle.posX = container.clientWidth;
    obstacle.style.left = container.clientWidth+"px";

    obstacles.push(obstacle);
    obstacleTimeUntil = obstacleTimeMin + Math.random() * (obstacleTimeMax-obstacleTimeMin) / gameVel;
}

// Function to move obstacles horizontally
function MoveObstacles() {
    for (var i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            GainPoints();
        }else{
            obstacles[i].posX -= CalculateMovement();
            obstacles[i].style.left = obstacles[i].posX+"px";
        }
    }
}

// Function to increase score and adjust game velocity
function GainPoints() {
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
function GameOver() {
    Crash();
    gameOver.style.display = "block";
}

// Function to detect collisions between the dinosaur and obstacles
function DetectCollision() {
    for (var i = 0; i < obstacles.length; i++) {
        if(obstacles[i].posX > dinoPosX + dino.clientWidth) {
            //EVADING
            break;
        }else{
            if(IsCollision(dino, obstacles[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

// Function to check collision between two elements
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}