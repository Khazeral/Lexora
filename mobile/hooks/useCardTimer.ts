import { useState, useEffect, useRef, useCallback } from "react";

export default function useCardTimer(
  gameMode: string,
  isFlipped: boolean,
  currentIndex: number,
  onTimeUp: () => void,
) {
  const [cardTimeLeft, setCardTimeLeft] = useState(10);
  const cardTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const totalTimeUsedRef = useRef(0);
  const lastCardTimeRef = useRef(10);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (gameMode === "timeattack" && isFlipped) {
      const timeUsed = 10 - lastCardTimeRef.current;
      if (timeUsed > 0) {
        totalTimeUsedRef.current += timeUsed;
      }
    }
  }, [isFlipped, gameMode]);

  useEffect(() => {
    if (cardTimerRef.current) {
      clearInterval(cardTimerRef.current);
      cardTimerRef.current = null;
    }

    if (gameMode !== "timeattack" || isFlipped) {
      return;
    }

    setCardTimeLeft(10);
    lastCardTimeRef.current = 10;

    cardTimerRef.current = setInterval(() => {
      setCardTimeLeft((prev) => {
        const newTime = prev - 1;
        lastCardTimeRef.current = newTime;

        if (newTime <= 0) {
          if (cardTimerRef.current) {
            clearInterval(cardTimerRef.current);
            cardTimerRef.current = null;
          }
          totalTimeUsedRef.current += 10;
          setTimeout(() => {
            onTimeUpRef.current();
          }, 0);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (cardTimerRef.current) {
        clearInterval(cardTimerRef.current);
        cardTimerRef.current = null;
      }
    };
  }, [currentIndex, gameMode, isFlipped]);

  const stopCardTimer = useCallback(() => {
    if (cardTimerRef.current) {
      clearInterval(cardTimerRef.current);
      cardTimerRef.current = null;
    }
  }, []);

  const getTotalTimeUsed = useCallback(() => {
    return totalTimeUsedRef.current;
  }, []);

  const resetTotalTime = useCallback(() => {
    totalTimeUsedRef.current = 0;
    lastCardTimeRef.current = 10;
  }, []);

  return { cardTimeLeft, stopCardTimer, getTotalTimeUsed, resetTotalTime };
}
