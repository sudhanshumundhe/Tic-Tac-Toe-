import { useState } from "react";
import "./App.css";

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: null, line: null, draw: true };
  }
  return null;
}

function Cell({ value, onClick, isWinning, winner, disabled }) {
  return (
    <button
      className={`cell ${value ? "filled" : ""} ${isWinning ? `winning ${winner === "X" ? "x-win" : "o-win"}` : ""} ${disabled && !isWinning ? "dimmed" : ""}`}
      onClick={onClick}
      disabled={!!value || disabled}
    >
      {value && (
        <span className={`cell-symbol ${value === "X" ? "x-color" : "o-color"}`}>
          {value}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 });

  function handleCellClick(idx) {
    if (gameOver || board[idx]) return;

    const newBoard = [...board];
    newBoard[idx] = current;
    setBoard(newBoard);

    const res = checkWinner(newBoard);
    if (res) {
      setGameOver(true);
      setResult(res);
      if (res.draw) {
        setScores((s) => ({ ...s, D: s.D + 1 }));
      } else {
        setScores((s) => ({ ...s, [res.winner]: s[res.winner] + 1 }));
      }
    } else {
      setCurrent(current === "X" ? "O" : "X");
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setCurrent("X");
    setGameOver(false);
    setResult(null);
  }

  function clearScores() {
    setScores({ X: 0, O: 0, D: 0 });
    resetGame();
  }

  const winningLine = result?.line || [];
  const statusClass = result?.draw
    ? "draw"
    : result?.winner
      ? `winner-${result.winner.toLowerCase()}`
      : `turn-${current.toLowerCase()}`;

  const statusText = result?.draw
    ? "Draw — well played"
    : result?.winner
      ? `${result.winner} wins!`
      : `${current}'s turn`;

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="title">Tic Tac Toe</div>
          <div className="subtitle">Two Player · Classic</div>
        </div>

        {/* Scoreboard */}
        <div className="scoreboard">
          <div className={`player-score ${!gameOver && current === "X" ? "active" : ""}`}>
            <div className="player-label">Player X</div>
            <div className="player-symbol x-color">X</div>
            <div className="score-num">{scores.X}</div>
          </div>
          <div className="draws-center">
            <div className="draws-label">Draws</div>
            <div className="draws-num">{scores.D}</div>
          </div>
          <div className={`player-score ${!gameOver && current === "O" ? "active" : ""}`}>
            <div className="player-label">Player O</div>
            <div className="player-symbol o-color">O</div>
            <div className="score-num">{scores.O}</div>
          </div>
        </div>

        {/* Status */}
        <div className="status-bar">
          <div className={`status-text ${statusClass}`}>
            {!result && <span className="turn-dot" />}
            <span>{statusText}</span>
          </div>
        </div>

        {/* Board */}
        <div className="board">
          {board.map((value, idx) => (
            <Cell
              key={idx}
              value={value}
              onClick={() => handleCellClick(idx)}
              isWinning={winningLine.includes(idx)}
              winner={result?.winner}
              disabled={gameOver}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="btn primary" onClick={resetGame}>
            New Game
          </button>
          <button className="btn" onClick={clearScores}>
            Clear Scores
          </button>
        </div>
      </div>
    </div>
  );
}