/* ===== Tic Tac Toe (Projects page) ===== */

// กัน error ถ้าเปิดหน้าอื่นที่ไม่มีเกม
const tttBoardEl = document.getElementById("tttBoard");
if (tttBoardEl) {
  const cells = document.querySelectorAll(".ttt-cell");
  const statusText = document.getElementById("tttStatus");
  const restartBtn = document.getElementById("tttRestart");
  const resetScoreBtn = document.getElementById("tttResetScore");

  const scoreXEl = document.getElementById("tttScoreX");
  const scoreOEl = document.getElementById("tttScoreO");
  const scoreDEl = document.getElementById("tttScoreD");

  const winnerTextEl = document.getElementById("tttWinnerText");
  const hintEl = document.getElementById("tttHint");

  let board = Array(9).fill("");
  let currentPlayer = "X";
  let running = true;

  let scores = { X: 0, O: 0, D: 0 };

  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // init
  updateUIForTurn();
  updateScoreUI();
  setWinner("—", "Make 3 in a row to win.");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });

  restartBtn.addEventListener("click", restartGame);
  resetScoreBtn.addEventListener("click", resetScore);

  function handleCellClick(cell, index){
    if(board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    const result = checkWinner();
    if (result.won) {
      running = false;
      scores[currentPlayer] += 1;
      updateScoreUI();
      highlightWin(result.line);
      statusText.textContent = `Winner: ${currentPlayer}`;
      setWinner(`${currentPlayer} wins 🎉`, "Press Restart Game to play again.");
      return;
    }

    if (result.draw) {
      running = false;
      scores.D += 1;
      updateScoreUI();
      statusText.textContent = "Draw!";
      setWinner("Draw 🤝", "Try again! Press Restart Game.");
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateUIForTurn();
  }

  function checkWinner(){
    for (const line of winConditions){
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { won: true, draw: false, line };
      }
    }
    if (!board.includes("")) return { won: false, draw: true, line: null };
    return { won: false, draw: false, line: null };
  }

  function highlightWin(line){
    if (!line) return;
    line.forEach(i => cells[i].classList.add("win"));
  }

  function clearHighlights(){
    cells.forEach(c => c.classList.remove("win"));
  }

  function updateUIForTurn(){
    statusText.textContent = `Turn: ${currentPlayer}`;
    setWinner(`Now: ${currentPlayer}`, "Good luck!");
  }

  function setWinner(text, hint){
    winnerTextEl.textContent = text;
    hintEl.textContent = hint;
  }

  function updateScoreUI(){
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
  }

  function restartGame(){
    board = Array(9).fill("");
    currentPlayer = "X";
    running = true;
    cells.forEach(cell => cell.textContent = "");
    clearHighlights();
    updateUIForTurn();
    statusText.textContent = "Turn: X";
  }

  function resetScore(){
    scores = { X: 0, O: 0, D: 0 };
    updateScoreUI();
    restartGame();
    setWinner("—", "Make 3 in a row to win.");
  }
}