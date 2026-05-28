import { useState, useEffect } from "react";

export default function App() {

  const emptyBoard = Array(9).fill(null);

  const [board, setBoard] = useState(emptyBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const winningPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  const checkWinner = (currentBoard) => {

    for (let pattern of winningPatterns) {

      const [a,b,c] = pattern;

      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }

    return null;
  };

  const minimax = (newBoard, depth, isMaximizing) => {

    const result = checkWinner(newBoard);

    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;

    if (!newBoard.includes(null)) return 0;

    if (isMaximizing) {

      let bestScore = -Infinity;

      for (let i = 0; i < 9; i++) {

        if (newBoard[i] === null) {

          newBoard[i] = "O";

          let score = minimax(newBoard, depth + 1, false);

          newBoard[i] = null;

          bestScore = Math.max(score, bestScore);
        }
      }

      return bestScore;

    } else {

      let bestScore = Infinity;

      for (let i = 0; i < 9; i++) {

        if (newBoard[i] === null) {

          newBoard[i] = "X";

          let score = minimax(newBoard, depth + 1, true);

          newBoard[i] = null;

          bestScore = Math.min(score, bestScore);
        }
      }

      return bestScore;
    }
  };

  const bestMove = () => {

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {

      if (board[i] === null) {

        board[i] = "O";

        let score = minimax(board, 0, false);

        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  useEffect(() => {

    if (!isPlayerTurn && !winner && !isDraw) {

      const timer = setTimeout(() => {

        const aiMove = bestMove();

        if (aiMove !== undefined) {

          const updatedBoard = [...board];

          updatedBoard[aiMove] = "O";

          setBoard(updatedBoard);

          const result = checkWinner(updatedBoard);

          if (result) {
            setWinner(result);
          }
          else if (!updatedBoard.includes(null)) {
            setIsDraw(true);
          }
          else {
            setIsPlayerTurn(true);
          }
        }

      }, 500);

      return () => clearTimeout(timer);
    }

  }, [isPlayerTurn, board]);

  const handleClick = (index) => {

    if (board[index] || winner || !isPlayerTurn) return;

    const updatedBoard = [...board];

    updatedBoard[index] = "X";

    setBoard(updatedBoard);

    const result = checkWinner(updatedBoard);

    if (result) {
      setWinner(result);
      return;
    }

    if (!updatedBoard.includes(null)) {
      setIsDraw(true);
      return;
    }

    setIsPlayerTurn(false);
  };

  const restartGame = () => {

    setBoard(emptyBoard);
    setWinner(null);
    setIsDraw(false);
    setIsPlayerTurn(true);
  };

  return (

    <div className="min-h-screen flex items-center justify-center px-4">
  
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
  
        <h1 className="text-5xl font-black text-white mb-8">
          AI Tic Tac Toe
        </h1>
  
        <div className="grid grid-cols-3 gap-4">
  
          {board.map((cell, index) => (
  
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="
                w-24 h-24
                rounded-2xl
                bg-slate-800
                text-white
                text-4xl
                font-black
                shadow-lg
                hover:bg-slate-700
              "
            >
              <span
                className={
                  cell === "X"
                    ? "text-cyan-400"
                    : "text-pink-400"
                }
              >
                {cell}
              </span>
  
            </button>
  
          ))}
  
        </div>
  
        <div className="mt-8 text-2xl font-bold text-white">
  
          {winner
            ? `${winner} Won`
            : isDraw
            ? "Draw Match"
            : isPlayerTurn
            ? "Your Turn"
            : "AI Thinking..."}
  
        </div>
  
        <button
          onClick={restartGame}
          className="
            mt-8
            px-6
            py-3
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-indigo-500
            text-white
            font-bold
            shadow-xl
          "
        >
          Restart Game
        </button>
  
      </div>
  
    </div>
  );
}