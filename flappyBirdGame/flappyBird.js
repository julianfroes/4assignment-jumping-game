document.addEventListener('DOMContentLoaded', function() {
  const bird = document.querySelector('.bird');
  const gameDisplay = document.querySelector('.game-container');
  const scoreDisplay = document.querySelector('#scoreValue');
  let birdLeft = 220;
  let birdBottom = 100;
  let gravity = 2;
  let isGameOver = false;
  let gap = 430;
  let score = 0;
  let gameTimerId;
  let obstacleTimerId;
  let obstacleTimeoutId;

  function startGame() {
      if (!isGameOver) {
          birdBottom -= gravity;
          bird.style.bottom = birdBottom + 'px';
          bird.style.left = birdLeft + 'px';
      }
  }

  gameTimerId = setInterval(startGame, 20);

  function control(e) {
      if (e.keyCode === 32 && !isGameOver) {
          jump();
      }
  }

  function jump() {
      let jumpSound = new Audio('../Audio/sfx_wing.mp3');
      jumpSound.play();
      if (birdBottom < 500) {
          birdBottom += 50;
          bird.style.bottom = birdBottom + 'px';
  
      }
  }

  document.addEventListener('keyup', control);

  function generateObstacle() {
      if (isGameOver) return;

      let obstacleLeft = 500;
      let randomHeight = Math.random() * 60;
      let obstacleBottom = randomHeight;
      const obstacle = document.createElement('div');
      const topObstacle = document.createElement('div');
      
      obstacle.classList.add('obstacle');
      topObstacle.classList.add('topObstacle');

      gameDisplay.appendChild(obstacle);
      gameDisplay.appendChild(topObstacle);
      obstacle.style.left = obstacleLeft + 'px';
      obstacle.style.bottom = obstacleBottom + 'px';
      topObstacle.style.left = obstacleLeft + 'px';
      topObstacle.style.bottom = obstacleBottom + gap + 'px';

      function moveObstacle() {
          obstacleLeft -= 2;
          obstacle.style.left = obstacleLeft + 'px';
          topObstacle.style.left = obstacleLeft + 'px';

          if (obstacleLeft === -60) {
              gameDisplay.removeChild(obstacle);
              gameDisplay.removeChild(topObstacle);
              score++;
              scoreDisplay.textContent = score;
              let pointSound = new Audio('../Audio/sfx_point.mp3');
              pointSound.play();
          }

          if (
              obstacleLeft > 200 &&
              obstacleLeft < 280 &&
              birdLeft === 220 &&
              (birdBottom < obstacleBottom + 153 || birdBottom > obstacleBottom + gap - 200) ||
              birdBottom === 0
          ) {
              gameOver();
          }
      }

      obstacleTimerId = setInterval(moveObstacle, 20);
      obstacleTimeoutId = setTimeout(generateObstacle, 3000);
  }

  generateObstacle();

  function gameOver() {
      let dieSound = new Audio('../Audio/die.mp3');
      dieSound.play();
      clearInterval(gameTimerId);
      clearInterval(obstacleTimerId);
      clearTimeout(obstacleTimeoutId);
      isGameOver = true;
      document.removeEventListener('keyup', control);
      document.addEventListener('keyup', restartGame);
  }

  function restartGame(e) {
      if (e.keyCode === 13) {
          const obstacleElements = document.querySelectorAll('.obstacle');
          obstacleElements.forEach((element) => {
              gameDisplay.removeChild(element);
          });
          const topObstacleElements = document.querySelectorAll('.topObstacle');
          topObstacleElements.forEach((element) => {
              gameDisplay.removeChild(element);
          });
          birdBottom = 100;
          isGameOver = false;
          score = 0;
          scoreDisplay.textContent = score;
          gameTimerId = setInterval(startGame, 20);
          generateObstacle();
          document.removeEventListener('keyup', restartGame);
          document.addEventListener('keyup', control);
      }
  }
});
