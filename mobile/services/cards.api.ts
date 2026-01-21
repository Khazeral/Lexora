import { fetchAPI } from "./api";

export async function getCardsByDeck(deckId: number) {
  return fetchAPI(`/decks/${deckId}/cards`);
}

export async function getCard(cardId: number) {
  return fetchAPI(`/cards/${cardId}`);
}

export async function createCard(payload: {
  word: string;
  translation: string;
  deckId: number;
}) {
  return fetchAPI("/cards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
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
