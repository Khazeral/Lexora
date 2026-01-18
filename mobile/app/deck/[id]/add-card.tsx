import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "@/services/cards.api";
import { Ionicons } from "@expo/vector-icons";

export default function AddCardScreen() {
  const { id } = useLocalSearchParams();
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deck", id] });
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to create card");
      console.error(error);
    },
  });

  const handleCreate = () => {
    if (!word.trim() || !translation.trim()) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    createCardMutation.mutate({
      word: word.trim(),
      translation: translation.trim(),
      deckId: Number(id),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Card</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Word / Term *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Hello"
              value={word}
              onChangeText={setWord}
              placeholderTextColor="#94a3b8"
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Translation / Definition *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Bonjour"
              value={translation}
              onChangeText={setTranslation}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewSide}>
                <Text style={styles.previewTitle}>Front</Text>
                <Text style={styles.previewText}>{word || "..."}</Text>
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewSide}>
                <Text style={styles.previewTitle}>Back</Text>
                <Text style={styles.previewText}>{translation || "..."}</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            createCardMutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleCreate}
          disabled={createCardMutation.isPending}
        >
          {createCardMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Add Card</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1e293b",
  },
  preview: {
    gap: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  previewSide: {
    gap: 4,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  previewText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  previewDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  createButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
