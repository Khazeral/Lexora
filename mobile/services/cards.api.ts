import { fetchAPI } from "./api";

export interface UnlockedAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface CreateCardResponse {
  card: {
    id: number;
    word: string;
    translation: string;
    deckId: number;
  };
  unlockedAchievements: UnlockedAchievement[];
}

export async function createCard(data: {
  word: string;
  translation: string;
  deckId: number;
}): Promise<CreateCardResponse> {
  return fetchAPI("/cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCardsByDeck(deckId: number) {
  return fetchAPI(`/decks/${deckId}/cards`);
}

export async function getCard(cardId: number) {
  return fetchAPI(`/cards/${cardId}`);
}

export async function updateCard(
  cardId: number,
  payload: { word?: string; translation?: string },
) {
  return fetchAPI(`/cards/${cardId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCard(cardId: number) {
  return fetchAPI(`/cards/${cardId}`, {
    method: "DELETE",
  });
}
