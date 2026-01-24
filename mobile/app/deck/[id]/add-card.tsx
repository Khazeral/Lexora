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
import AddCardForm from "@/app/components/cards/add-card/AddCardForm";
import CardPreview from "@/app/components/cards/CardPreview";
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
    watch,
    reset,
    formState: { errors },
  } = useForm<AddCardFormData>({
    defaultValues: {
      word: "",
      translation: "",
    },
  });

  const word = watch("word");
  const translation = watch("translation");

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deck", id] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
    onError: (error) => {
      Alert.alert("Error", t("addCard.errors.createFailed"));
      console.error(error);
    },
  });

  const onSubmit = (data: AddCardFormData) => {
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

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AddCardHeader
          onBack={handleCancel}
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

          <AddCardForm control={control} errors={errors} />

          <CardPreview word={word} translation={translation} />
        </ScrollView>

        <AddCardActions
          onAdd={handleSubmit(onSubmit)}
          onAddAnother={handleSubmit(onAddAnother)}
          onCancel={handleCancel}
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
