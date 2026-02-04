import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:3333";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      if (token) {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data);
        } else {
          await AsyncStorage.removeItem("auth_token");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await AsyncStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Email ou mot de passe incorrect");
      }

      const data = await response.json();

      await AsyncStorage.setItem("auth_token", data.token);

      setUser(data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function signup(username: string, email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      const data = await response.json();

      await AsyncStorage.setItem("auth_token", data.token);

      setUser(data.user);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      const token = await AsyncStorage.getItem("auth_token");

      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await AsyncStorage.removeItem("auth_token");
      setUser(null);
      router.replace("/(auth)/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export async function getAuthToken(): Promise<string | null> {
  return await AsyncStorage.getItem("auth_token");
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Non authentifié");
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
