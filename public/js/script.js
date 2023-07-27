const playGround = document.querySelector(".game_board");
const scoreElement = document.querySelector(".score");
const highestScoreElement = document.querySelector(".highest_score");
const highestScoreElement2 = document.querySelector(".highest_score2");

let gameOver = false;
let foodX, foodY;
let snakeX = 15,
    snakeY = 15;
let snakeBody = [];
let velocityX = 0,
    velocityY = 0;
let setIntervalId;
let score = 0;
let highestScore = localStorage.getItem("highest_score") || 0;

highestScoreElement.innerText = `Highest score: ${highestScore}`;
highestScoreElement2.innerText = `Save Your best score: ${highestScore}`;

const highest = {
  name: "Guest",
  score: 0,
};

document.getElementById("save").onclick = function () {
  highest.name = document.getElementById("name").value;
  highest.score = highestScore;
  postJSON(highest);
};
function getCurrentURL() {
  return window.location.href;
}

const url = getCurrentURL();

async function postJSON(highest) {
  try {
    const response = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(highest),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

const gameOverHandler = () => {
  clearInterval(setIntervalId);
  document.getElementById("popup").classList.add("open-popup");
  document.getElementById("reset").onclick = () => {
    location.reload();
  };
};

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
    if (e.repeat) return;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
    if (e.repeat) return;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
    if (e.repeat) return;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
    if (e.repeat) return;
  }
  initGame();
};

const initGame = () => {
  if (gameOver) return gameOverHandler();

  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (foodX === snakeX && foodY === snakeY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;
    highestScore = score >= highestScore ? score : highestScore;
    localStorage.setItem("highest_score", highestScore);
    scoreElement.innerText = `Score: ${score}`;
    highestScoreElement.innerText = `Highest score: ${highestScore}`;
    highestScoreElement2.innerText = `Save Your best score: ${highestScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];
  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }
  
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] == snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playGround.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 150);
document.addEventListener("keydown", changeDirection);
