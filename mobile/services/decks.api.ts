import { fetchAPI } from "./api";

export async function getDecks() {
  return fetchAPI("/decks");
}

export async function getDeck(id: number) {
  return fetchAPI(`/decks/${id}`);
}

export async function getHomeData() {
  return fetchAPI("/decks/home");
}

export async function createDeck(payload: {
  name: string;
  description?: string;
}) {
  return fetchAPI("/decks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDeck(
  id: number,
  payload: { name?: string; description?: string },
) {
  return fetchAPI(`/decks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDeck(id: number) {
  return fetchAPI(`/decks/${id}`, {
    method: "DELETE",
  });
}
