import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCard } from "@/services/cards.api";
import AddCardHeader from "@/app/components/cards/add-card/AddCardHeader";
import AddCardTips from "@/app/components/cards/add-card/AddCardTips";
import InteractiveCard from "@/app/components/cards/add-card/InteractiveCard";
import AddCardActions from "@/app/components/cards/add-card/AddCardActions";

type AddCardFormData = {
  word: string;
  translation: string;
};

export default function AddCardScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showTips, setShowTips] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCardFormData>({
    defaultValues: {
      word: "",
      translation: "",
    },
  });

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deck", id] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
    onError: (error) => {
      Alert.alert("Error", t("cards.addCard.errors.createFailed"));
      console.error(error);
    },
  });

  const onSubmit = (data: AddCardFormData) => {
    if (!data.word || !data.translation) {
      Alert.alert("Error", t("cards.addCard.errors.fillRequired"));
      return;
    }

    createCardMutation.mutate(
      {
        word: data.word.trim(),
        translation: data.translation.trim(),
        deckId: Number(id),
      },
      {
        onSuccess: () => {
          Alert.alert("✅ " + t("cards.addCard.success"));
          router.back();
        },
      },
    );
  };

  const onAddAnother = (data: AddCardFormData) => {
    if (!data.word || !data.translation) {
      Alert.alert("Error", t("cards.addCard.errors.fillRequired"));
      return;
    }

    createCardMutation.mutate(
      {
        word: data.word.trim(),
        translation: data.translation.trim(),
        deckId: Number(id),
      },
      {
        onSuccess: () => {
          reset();
          Alert.alert("✅ " + t("cards.addCard.success"));
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AddCardHeader
          onBack={() => router.back()}
          onToggleTips={() => setShowTips(!showTips)}
          showingTips={showTips}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showTips && <AddCardTips />}

          <InteractiveCard control={control} errors={errors} />
        </ScrollView>

        <AddCardActions
          onAdd={handleSubmit(onSubmit)}
          onAddAnother={handleSubmit(onAddAnother)}
          isLoading={createCardMutation.isPending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
});
