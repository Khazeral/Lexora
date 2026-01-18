export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Deck {
  id: string;
  name: string;
  userId: string;
  cardCount: number;
  createdAt: string;
}

export interface DeckDetail {
  id: number;
  name: string;
  cards: {
    id: number;
    word: string;
    translation: string;
    progress: {
      successCount: number;
      failureCount: number;
      currentStreak: number;
      maxStreak: number;
      status: string;
    };
  }[];
}

export interface Card {
  id: string;
  deckId: string;
  word: string;
  translation: string;
  createdAt: string;
}

export interface UserProgress {
  totalDecks: number;
  totalCards: number;
  cardsToReview: number;
}

export type TrainingMode = "random" | "ordered";

export interface TrainingSession {
  deckId: string;
  mode: TrainingMode;
  cards: Card[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
}
