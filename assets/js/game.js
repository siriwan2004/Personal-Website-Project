console.log("Tic Tac Toe Loaded");

/* ===== Tic Tac Toe ===== */

const tttBoardEl = document.getElementById("tttBoard");

if (tttBoardEl) {

  // ===== ELEMENTS =====
  const cells = document.querySelectorAll(".ttt-cell");
  const statusText = document.getElementById("tttStatus");
  const restartBtn = document.getElementById("tttRestart");
  const resetScoreBtn = document.getElementById("tttResetScore");

  const scoreXEl = document.getElementById("tttScoreX");
  const scoreOEl = document.getElementById("tttScoreO");
  const scoreDEl = document.getElementById("tttScoreD");

  const winnerTextEl = document.getElementById("tttWinnerText");
  const hintEl = document.getElementById("tttHint");

  const modePVP = document.getElementById("modePVP");
  const modeCPU = document.getElementById("modeCPU");
  const modeText = document.getElementById("tttModeText");

  // ===== GAME STATE =====
  let gameMode = "pvp"; // pvp | cpu
  let board = Array(9).fill("");
  let currentPlayer = "X";
  let running = true;

  let scores = { X: 0, O: 0, D: 0 };

  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // ===== INIT =====
  updateUIForTurn();
  updateScoreUI();
  updateModeUI();
  setWinner("—", "Make 3 in a row to win.");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });

  restartBtn.addEventListener("click", restartGame);
  resetScoreBtn.addEventListener("click", resetScore);

  // ===== MODE BUTTONS =====
  if (modePVP && modeCPU) {

    modePVP.addEventListener("click", () => {
      gameMode = "pvp";
      setActiveModeButton();
      restartGame();
      updateModeUI();
    });

    modeCPU.addEventListener("click", () => {
      gameMode = "cpu";
      setActiveModeButton();
      restartGame();
      updateModeUI();
    });
  }

  function setActiveModeButton(){
    if (!modePVP || !modeCPU) return;

    modePVP.classList.remove("active");
    modeCPU.classList.remove("active");

    if (gameMode === "pvp") modePVP.classList.add("active");
    if (gameMode === "cpu") modeCPU.classList.add("active");
  }

  // ===== CLICK CELL =====
  function handleCellClick(cell, index){
    if (board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    const result = checkWinner();

    if (result.won) {
      endGame(currentPlayer, result.line);
      return;
    }

    if (result.draw) {
      endGame("D", null);
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateUIForTurn();

    // ===== AI MOVE =====
    if (gameMode === "cpu" && currentPlayer === "O") {
      setTimeout(aiMove, 400);
    }
  }

  // =====================================================
  // 🤖 SMART AI
  // =====================================================
  function aiMove(){
    if (!running) return;

    const empty = board
      .map((v,i) => v === "" ? i : null)
      .filter(v => v !== null);

    if (empty.length === 0) return;

    // 1. AI ชนะได้ → ชนะเลย
    for (let i of empty) {
      let temp = [...board];
      temp[i] = "O";

      if (isWinning(temp, "O")) {
        makeMove(i, "O");
        return;
      }
    }

    // 2. กันผู้เล่นชนะ
    for (let i of empty) {
      let temp = [...board];
      temp[i] = "X";

      if (isWinning(temp, "X")) {
        makeMove(i, "O");
        return;
      }
    }

    // 3. สุ่ม
    const move = empty[Math.floor(Math.random() * empty.length)];
    makeMove(move, "O");
  }

  function makeMove(index, player){
    board[index] = player;
    cells[index].textContent = player;

    const result = checkWinner();

    if (result.won) {
      endGame(player, result.line);
      return;
    }

    if (result.draw) {
      endGame("D", null);
      return;
    }

    currentPlayer = "X";
    updateUIForTurn();
  }

  function isWinning(b, player){
    return winConditions.some(([a,b2,c]) => {
      return b[a] === player && b[b2] === player && b[c] === player;
    });
  }

  // ===== WIN CHECK =====
  function checkWinner(){
    for (const line of winConditions){
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { won: true, draw: false, line };
      }
    }

    if (!board.includes("")) {
      return { won: false, draw: true, line: null };
    }

    return { won: false, draw: false, line: null };
  }

  // ===== END GAME =====
  function endGame(winner, line){
    running = false;

    if (winner === "D") {
      scores.D++;
      updateScoreUI();
      setWinner("Draw 🤝", "Try again!");
      statusText.textContent = "Draw!";
      return;
    }

    scores[winner]++;
    updateScoreUI();

    if (line) highlightWin(line);

    statusText.textContent = `Winner: ${winner}`;
    setWinner(`${winner} wins 🎉`, "Press Restart to play again.");
  }

  function highlightWin(line){
    line.forEach(i => cells[i].classList.add("win"));
  }

  function clearHighlights(){
    cells.forEach(c => c.classList.remove("win"));
  }

  // ===== UI =====
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

  function updateModeUI(){
    if (!modeText) return;

    modeText.textContent =
      gameMode === "pvp"
        ? "Mode: Player vs Player 👥"
        : "Mode: Player vs AI 🤖";
  }

  // ===== RESET =====
  function restartGame(){
    board = Array(9).fill("");
    currentPlayer = "X";
    running = true;

    cells.forEach(c => c.textContent = "");
    clearHighlights();

    updateUIForTurn();
    updateModeUI();
    statusText.textContent = "Turn: X";
  }

  function resetScore(){
    scores = { X: 0, O: 0, D: 0 };
    updateScoreUI();
    restartGame();
    setWinner("—", "Make 3 in a row to win.");
  }
}