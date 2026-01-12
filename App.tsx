
import React, { useState, useEffect, useCallback } from 'react';
import { Player, GameMode, GameState } from './types';
import { getGeminiMove } from './services/geminiService';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    xIsNext: true,
    winner: null,
    winningLine: null,
    commentary: "欢迎来到未来井字棋！准备好挑战了吗？",
    isAiThinking: false,
  });

  const [mode, setMode] = useState<GameMode>(GameMode.PVE);

  const calculateWinner = (board: Player[]) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    if (board.every(cell => cell !== null)) {
      return { winner: 'Draw' as const, line: null };
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (gameState.winner || gameState.board[i] || gameState.isAiThinking) return;

    const newBoard = [...gameState.board];
    newBoard[i] = gameState.xIsNext ? 'X' : 'O';

    const winInfo = calculateWinner(newBoard);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      xIsNext: !prev.xIsNext,
      winner: winInfo ? winInfo.winner : null,
      winningLine: winInfo ? winInfo.line : null,
      commentary: winInfo ? (winInfo.winner === 'Draw' ? "平局！再来一局？" : `胜利者是 ${winInfo.winner}！`) : prev.commentary
    }));
  };

  const handleAiMove = useCallback(async () => {
    if (gameState.winner || gameState.xIsNext || mode === GameMode.PVP) return;

    setGameState(prev => ({ ...prev, isAiThinking: true, commentary: "Gemini 正在深思熟虑..." }));

    const aiResponse = await getGeminiMove(gameState.board, 'O');
    
    const newBoard = [...gameState.board];
    newBoard[aiResponse.index] = 'O';

    const winInfo = calculateWinner(newBoard);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      xIsNext: true,
      winner: winInfo ? winInfo.winner : null,
      winningLine: winInfo ? winInfo.line : null,
      isAiThinking: false,
      commentary: aiResponse.commentary
    }));
  }, [gameState.board, gameState.winner, gameState.xIsNext, mode]);

  useEffect(() => {
    if (!gameState.xIsNext && !gameState.winner && mode === GameMode.PVE) {
      const timer = setTimeout(() => {
        handleAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.xIsNext, gameState.winner, mode, handleAiMove]);

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      xIsNext: true,
      winner: null,
      winningLine: null,
      commentary: "新局开始！谁会赢？",
      isAiThinking: false,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent">
      {/* Header */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-5xl md:text-6xl font-orbitron font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-rose-400">
          TIC-TAC-TOE
        </h1>
        <p className="text-slate-400 font-light text-lg">POWERED BY GEMINI 3 FLASH</p>
      </div>

      {/* Game Mode Selector */}
      <div className="flex bg-slate-800/50 p-1 rounded-full border border-slate-700 mb-8 w-64">
        <button 
          onClick={() => { setMode(GameMode.PVE); resetGame(); }}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${mode === GameMode.PVE ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'text-slate-400 hover:text-white'}`}
        >
          VS AI
        </button>
        <button 
          onClick={() => { setMode(GameMode.PVP); resetGame(); }}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${mode === GameMode.PVP ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-400 hover:text-white'}`}
        >
          2 PLAYERS
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl items-start">
        
        {/* Left Side: Status Info (Mobile hidden, shown on larger screens) */}
        <div className="hidden lg:flex flex-col space-y-6">
          <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-2xl backdrop-blur-xl">
            <h3 className="text-sky-400 font-orbitron text-sm mb-4">CURRENT TURN</h3>
            <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${gameState.xIsNext ? 'border-sky-500/50 bg-sky-500/10' : 'border-slate-800 bg-slate-800/30 opacity-50'}`}>
              <div className="w-10 h-10 flex items-center justify-center bg-sky-500 rounded-lg text-xl font-bold">X</div>
              <span className="font-semibold text-sky-100">Player One</span>
            </div>
            <div className={`flex items-center space-x-4 p-4 rounded-xl border mt-3 transition-all ${!gameState.xIsNext ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-800/30 opacity-50'}`}>
              <div className="w-10 h-10 flex items-center justify-center bg-rose-500 rounded-lg text-xl font-bold">O</div>
              <span className="font-semibold text-rose-100">{mode === GameMode.PVE ? 'Gemini AI' : 'Player Two'}</span>
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-2xl backdrop-blur-xl min-h-[150px]">
            <h3 className="text-amber-400 font-orbitron text-sm mb-4">GEMINI INSIGHTS</h3>
            <p className="text-slate-300 italic leading-relaxed">
              "{gameState.commentary}"
            </p>
          </div>
        </div>

        {/* Center: The Board */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative group">
            {/* Animated Glow behind the board */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-slate-900/80 p-4 rounded-2xl border border-white/10 grid grid-cols-3 gap-3 backdrop-blur-sm">
              {gameState.board.map((cell, i) => (
                <button
                  key={i}
                  disabled={!!gameState.winner || !!cell || gameState.isAiThinking}
                  onClick={() => handleClick(i)}
                  className={`w-20 h-20 md:w-28 md:h-28 flex items-center justify-center text-4xl md:text-5xl font-orbitron font-bold rounded-xl transition-all duration-300
                    ${!cell && !gameState.winner ? 'bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer border border-slate-700/50' : 'bg-slate-800/20 border border-slate-800 cursor-default'}
                    ${gameState.winningLine?.includes(i) ? 'scale-105 border-yellow-400/50 bg-yellow-400/10 ring-2 ring-yellow-400/50' : ''}
                  `}
                >
                  {cell === 'X' && <span className="text-sky-400 neon-text-blue animate-in fade-in zoom-in duration-300">X</span>}
                  {cell === 'O' && <span className="text-rose-400 neon-text-rose animate-in fade-in zoom-in duration-300">O</span>}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={resetGame}
            className="group relative flex items-center space-x-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/20"
          >
            <i className="fas fa-redo-alt group-hover:rotate-180 transition-transform duration-500"></i>
            <span>RESTART GAME</span>
          </button>
        </div>

        {/* Right Side: Score/Stats (Mobile hidden) */}
        <div className="hidden lg:flex flex-col space-y-6">
          <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-2xl backdrop-blur-xl">
            <h3 className="text-emerald-400 font-orbitron text-sm mb-4">GAME STATS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-400">
                <span>Winner:</span>
                <span className={`font-bold ${gameState.winner === 'X' ? 'text-sky-400' : gameState.winner === 'O' ? 'text-rose-400' : 'text-slate-300'}`}>
                  {gameState.winner ? (gameState.winner === 'Draw' ? 'None (Draw)' : gameState.winner) : 'Ongoing...'}
                </span>
              </div>
              <div className="h-px bg-slate-800 w-full"></div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Mode:</span>
                <span className="text-slate-200">{mode === GameMode.PVE ? 'Man vs Machine' : 'Classic PVP'}</span>
              </div>
            </div>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center space-x-3 text-indigo-300 font-semibold mb-2">
              <i className="fas fa-robot"></i>
              <span>AI CAPACITY</span>
            </div>
            <p className="text-sm text-indigo-200/60 leading-relaxed">
              Gemini 3 Flash is simulating millions of possible board states to find the perfect counter-move. Good luck.
            </p>
          </div>
        </div>

        {/* Mobile View Only: Status & Commentary */}
        <div className="lg:hidden w-full space-y-4">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 text-center italic text-slate-300">
            "{gameState.commentary}"
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className={`p-3 rounded-lg text-center font-bold ${gameState.xIsNext ? 'bg-sky-500/20 border border-sky-500 text-sky-400' : 'bg-slate-800/40 border border-slate-700 text-slate-500'}`}>PLAYER X</div>
             <div className={`p-3 rounded-lg text-center font-bold ${!gameState.xIsNext ? 'bg-rose-500/20 border border-rose-500 text-rose-400' : 'bg-slate-800/40 border border-slate-700 text-slate-500'}`}>PLAYER O</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-auto py-8 text-slate-600 text-sm tracking-widest uppercase flex items-center space-x-2">
        <span>Strategic Engine v1.0</span>
        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
        <span>Secure Session</span>
      </footer>
    </div>
  );
};

export default App;
