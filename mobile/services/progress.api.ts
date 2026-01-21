import { fetchAPI } from "./api";

export async function answerCard(
  userId: number,
  cardId: number,
  success: boolean,
) {
  return fetchAPI(`/progress/${userId}/${cardId}/answer`, {
    method: "POST",
    body: JSON.stringify({ success }),
  });
}

export async function getCardProgress(userId: number, cardId: number) {
  return fetchAPI(`/progress/${userId}/${cardId}`);
}

export async function getDeckProgress(userId: number, deckId: number) {
  return fetchAPI(`/progress/${userId}/decks/${deckId}`);
}
