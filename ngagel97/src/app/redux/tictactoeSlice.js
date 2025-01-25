import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: Array(9).fill(null),
  xIsNext: true,
  winner: null,
  isVsBot: true,
  botSymbol: 'O',
  playerSymbol: 'X',
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  if (squares.every(square => square !== null)) {
    return 'DRAW';
  }
  
  return null;
}

// Minimax algorithm for bot moves
function minimax(board, depth, isMaximizing, botSymbol, playerSymbol) {
  const winner = calculateWinner(board);
  
  if (winner === botSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (winner === 'DRAW') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = botSymbol;
        const score = minimax(board, depth + 1, false, botSymbol, playerSymbol);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true, botSymbol, playerSymbol);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getBotMove(board, botSymbol, playerSymbol) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = botSymbol;
      const score = minimax(board, 0, false, botSymbol, playerSymbol);
      board[i] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

const tictactoeSlice = createSlice({
  name: 'tictactoe',
  initialState,
  reducers: {
    makeMove: (state, action) => {
      const { position } = action.payload;
      if (state.board[position] || state.winner) {
        return;
      }
      
      if (state.isVsBot) {
        // Bot mode
        state.board[position] = state.playerSymbol;
        state.xIsNext = !state.xIsNext;
        state.winner = calculateWinner(state.board);

        if (!state.winner) {
          const botMove = getBotMove([...state.board], state.botSymbol, state.playerSymbol);
          if (botMove !== null) {
            state.board[botMove] = state.botSymbol;
            state.xIsNext = !state.xIsNext;
            state.winner = calculateWinner(state.board);
          }
        }
      } else {
        // Player vs Player mode
        state.board[position] = state.xIsNext ? 'X' : 'O';
        state.xIsNext = !state.xIsNext;
        state.winner = calculateWinner(state.board);
      }
    },
    resetGame: (state) => {
      state.board = Array(9).fill(null);
      state.xIsNext = true;
      state.winner = null;
    },
    toggleGameMode: (state) => {
      state.isVsBot = !state.isVsBot;
      state.board = Array(9).fill(null);
      state.xIsNext = true;
      state.winner = null;
    }
  },
});

export const { makeMove, resetGame, toggleGameMode } = tictactoeSlice.actions;
export default tictactoeSlice.reducer;