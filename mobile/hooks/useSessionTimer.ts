import { useState, useEffect, useRef } from "react";

export default function useSessionTimer(gameMode: string, isActive: boolean) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timePenalty, setTimePenalty] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameMode === "speedrun" && isActive) {
      const start = Date.now();
      setStartTime(start);
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 100);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameMode, isActive]);

  const addPenalty = (seconds: number) => {
    setTimePenalty((prev) => prev + seconds);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const getTotalTime = () => elapsedTime + timePenalty;

  return {
    elapsedTime,
    timePenalty,
    startTime,
    addPenalty,
    stopTimer,
    getTotalTime,
  };
}
