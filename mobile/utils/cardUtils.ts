import { Card } from "@/types";

export const shuffle = (array: Card[]): Card[] => {
  const copy = [...array];
  let currentIndex = copy.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[currentIndex],
    ];
  }

  return copy;
};
