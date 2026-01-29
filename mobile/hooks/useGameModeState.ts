import { useRef, useState } from "react";

export default function useGameModeState(gameMode: string) {
  const [lives, setLives] = useState(3);
  const [isPerfectRun, setIsPerfectRun] = useState(true);
  const livesRef = useRef(3);

  const loseLife = () => {
    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);
    return newLives;
  };

  const failPerfectRun = () => {
    setIsPerfectRun(false);
  };

  const resetGameState = () => {
    setLives(3);
    livesRef.current = 3;
    setIsPerfectRun(true);
  };

  return {
    lives,
    livesRef,
    isPerfectRun,
    loseLife,
    failPerfectRun,
    resetGameState,
  };
}
