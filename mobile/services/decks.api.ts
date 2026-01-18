export async function fetchDecks() {
  const res = await fetch("http://localhost:3333/decks");

  if (!res.ok) {
    throw new Error("Failed to fetch decks");
  }

  return res.json();
}
