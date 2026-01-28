import { useState, useEffect, useRef } from "react";

export default function useCardTimer(
  gameMode: string,
  isFlipped: boolean,
  currentIndex: number,
  onTimeUp: () => void,
) {
  const [cardTimeLeft, setCardTimeLeft] = useState(10);
  const cardTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameMode === "timeattack" && !isFlipped) {
      setCardTimeLeft(10);

      cardTimerRef.current = setInterval(() => {
        setCardTimeLeft((prev) => {
          if (prev <= 1) {
            if (cardTimerRef.current) clearInterval(cardTimerRef.current);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (cardTimerRef.current) {
          clearInterval(cardTimerRef.current);
        }
      };
    } else if (gameMode === "timeattack" && isFlipped) {
      if (cardTimerRef.current) {
        clearInterval(cardTimerRef.current);
      }
    }
  }, [isFlipped, currentIndex, gameMode, onTimeUp]);

  const stopCardTimer = () => {
    if (cardTimerRef.current) {
      clearInterval(cardTimerRef.current);
    }
  };

  return { cardTimeLeft, stopCardTimer };
}
