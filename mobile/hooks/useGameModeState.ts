import { useState } from "react";

export default function useGameModeState(gameMode: string) {
  const [lives, setLives] = useState(3);
  const [isPerfectRun, setIsPerfectRun] = useState(true);

  const loseLife = () => {
    setLives((prev) => prev - 1);
    return lives - 1;
  };

  const failPerfectRun = () => {
    setIsPerfectRun(false);
  };

  const resetGameState = () => {
    setLives(3);
    setIsPerfectRun(true);
  };

  return {
    lives,
    isPerfectRun,
    loseLife,
    failPerfectRun,
    resetGameState,
  };
}
