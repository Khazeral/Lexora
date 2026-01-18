import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

const API_URL = "http://localhost:3333";

async function request(url: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<User> {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  await AsyncStorage.setItem("token", data.token);
  return data.user;
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<User> {
  const data = await request("/users", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

  await AsyncStorage.setItem("token", data.token);
  return data.user;
}

export async function getCurrentUser(): Promise<User> {
  return request("/me");
}

export async function logout(): Promise<void> {
  await request("/logout", { method: "POST" });
  await AsyncStorage.removeItem("token");
}
