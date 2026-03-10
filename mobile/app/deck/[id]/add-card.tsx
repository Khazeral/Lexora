import React, { useState, useRef } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCard } from "@/services/cards.api";
import AddCardHeader from "@/app/components/cards/add-card/AddCardHeader";
import InteractiveCard, {
  InteractiveCardRef,
} from "@/app/components/cards/add-card/InteractiveCard";
import AddCardActions from "@/app/components/cards/add-card/AddCardActions";
import Scanlines from "@/app/components/Scanlines";
import Toast from "@/app/components/ui/Toast";

type AddCardFormData = {
  word: string;
  translation: string;
};

export default function AddCardScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [shouldGoBack, setShouldGoBack] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const cardRef = useRef<InteractiveCardRef>(null);

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

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ visible: true, message, type });
  };

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["deck", id] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });

      if (
        response.unlockedAchievements &&
        response.unlockedAchievements.length > 0
      ) {
      } else {
        if (shouldGoBack) {
          showToast(t("cards.addCard.success"));
          setTimeout(() => router.back(), 1200);
        } else {
          reset();
          cardRef.current?.resetFlip();
          showToast(t("cards.addCard.success"));
        }
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      showToast(t("cards.addCard.errors.createFailed"), "error");
    },
  });

  const onSubmit = (data: AddCardFormData) => {
    if (!data.word || !data.translation) {
      showToast(t("cards.addCard.errors.fillRequired"), "error");
      return;
    }

    setShouldGoBack(true);
    createCardMutation.mutate({
      word: data.word.trim(),
      translation: data.translation.trim(),
      deckId: Number(id),
    });
  };

  const onAddAnother = (data: AddCardFormData) => {
    if (!data.word || !data.translation) {
      showToast(t("cards.addCard.errors.fillRequired"), "error");
      return;
    }

    setShouldGoBack(false);
    createCardMutation.mutate({
      word: data.word.trim(),
      translation: data.translation.trim(),
      deckId: Number(id),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Scanlines />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AddCardHeader onBack={() => router.back()} />

        <ScrollView
          className="flex-1"
          contentContainerClassName="p-6 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <InteractiveCard ref={cardRef} control={control} errors={errors} />
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
