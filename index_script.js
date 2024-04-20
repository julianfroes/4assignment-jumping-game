function showGame(game) {
    document.querySelectorAll('.game').forEach(function(game) {
      game.classList.add('hidden');
    });
    let gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    let gameFrame = document.createElement('iframe');
    gameFrame.src = game + '_page.html';
    gameFrame.classList.add('game');
    gameFrame.classList.remove('hidden');
    gameContainer.appendChild(gameFrame);
  }