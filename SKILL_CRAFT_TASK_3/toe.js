const cells = document.querySelectorAll("[data-cell]");
const board = document.querySelector(".board");
const statusMessage = document.querySelector(".status-message");
const resetButton = document.getElementById("reset");
const pvpButton = document.getElementById("pvp");
const pvcButton = document.getElementById("pvc");

let isPlayerTurn = true;
let currentPlayer = "X";
let gameMode = "pvp"; // 'pvp' or 'pvc'
let boardState = Array(9).fill("");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleClick(e) {
  const cell = e.target;
  const index = Array.from(cells).indexOf(cell);

  if (boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWin()) {
    statusMessage.textContent = `${currentPlayer} Wins!`;
    endGame();
    return;
  }

  if (boardState.every(cell => cell !== "")) {
    statusMessage.textContent = "It's a Draw!";
    endGame();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "pvc" && currentPlayer === "O") {
    computerMove();
  } else {
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function computerMove() {
  const availableCells = boardState
    .map((val, index) => (val === "" ? index : null))
    .filter(index => index !== null);

  const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
  boardState[randomIndex] = currentPlayer;

  const cell = cells[randomIndex];
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWin()) {
    statusMessage.textContent = `${currentPlayer} Wins!`;
    endGame();
    return;
  }

  if (boardState.every(cell => cell !== "")) {
    statusMessage.textContent = "It's a Draw!";
    endGame();
    return;
  }

  currentPlayer = "X";
  statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWin() {
  return winningCombinations.some(combination =>
    combination.every(index => boardState[index] === currentPlayer)
  );
}

function endGame() {
  cells.forEach(cell => cell.removeEventListener("click", handleClick));
}

function resetGame() {
  boardState.fill("");
  currentPlayer = "X";
  statusMessage.textContent = "Player X's Turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
    cell.addEventListener("click", handleClick);
  });
}

pvpButton.addEventListener("click", () => {
  gameMode = "pvp";
  resetGame();
});

pvcButton.addEventListener("click", () => {
  gameMode = "pvc";
  resetGame();
});

resetButton.addEventListener("click", resetGame);

cells.forEach(cell => cell.addEventListener("click", handleClick));
