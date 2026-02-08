import { useState, useRef } from "react";

export default function useSessionStats() {
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionIncorrect, setSessionIncorrect] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const sessionCorrectRef = useRef(0);
  const sessionIncorrectRef = useRef(0);
  const bestStreakRef = useRef(0);

  const recordCorrect = () => {
    sessionCorrectRef.current += 1;
    setSessionCorrect((prev) => prev + 1);
    setCurrentStreak((prev) => {
      const newStreak = prev + 1;
      if (newStreak > bestStreakRef.current) {
        bestStreakRef.current = newStreak;
        setBestStreak(newStreak);
      }
      return newStreak;
    });
  };

  const recordIncorrect = () => {
    sessionIncorrectRef.current += 1;
    setSessionIncorrect((prev) => prev + 1);
    setCurrentStreak(0);
  };

  const resetStats = () => {
    setSessionCorrect(0);
    setSessionIncorrect(0);
    setCurrentStreak(0);
    setBestStreak(0);
    sessionCorrectRef.current = 0;
    sessionIncorrectRef.current = 0;
    bestStreakRef.current = 0;
  };

  return {
    sessionCorrect,
    sessionIncorrect,
    currentStreak,
    bestStreak,
    sessionCorrectRef,
    sessionIncorrectRef,
    bestStreakRef,
    recordCorrect,
    recordIncorrect,
    resetStats,
  };
}
