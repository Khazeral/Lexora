import AsyncStorage from "@react-native-async-storage/async-storage";

const DEV_URL = "http://localhost:3333";
const PROD_URL = "https://lexora-api-a8ae.onrender.com";

const API_URL = __DEV__ ? DEV_URL : PROD_URL;

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = await AsyncStorage.getItem("auth_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
