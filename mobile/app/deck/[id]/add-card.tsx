import React, { useState, useRef } from "react";
import {
  View,
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
import { createCard, CreateCardResponse } from "@/services/cards.api";
import AddCardHeader from "@/app/components/cards/add-card/AddCardHeader";
import AddCardTips from "@/app/components/cards/add-card/AddCardTips";
import InteractiveCard, {
  InteractiveCardRef,
} from "@/app/components/cards/add-card/InteractiveCard";
import AddCardActions from "@/app/components/cards/add-card/AddCardActions";
import AchievementUnlockedModal from "@/app/components/AchievementUnlockModal";
import Scanlines from "@/app/components/Scanlines";

type AddCardFormData = {
  word: string;
  translation: string;
};

export default function AddCardScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showTips, setShowTips] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    CreateCardResponse["unlockedAchievements"]
  >([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [shouldGoBack, setShouldGoBack] = useState(false);

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
        setUnlockedAchievements(response.unlockedAchievements);
        setShowAchievementModal(true);
      } else {
        if (shouldGoBack) {
          Alert.alert("✅ " + t("cards.addCard.success"));
          router.back();
        } else {
          reset();
          cardRef.current?.resetFlip();
          Alert.alert("✅ " + t("cards.addCard.success"));
        }
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      Alert.alert("Error", t("cards.addCard.errors.createFailed"));
    },
  });

  const onSubmit = (data: AddCardFormData) => {
    if (!data.word || !data.translation) {
      Alert.alert("Error", t("cards.addCard.errors.fillRequired"));
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
      Alert.alert("Error", t("cards.addCard.errors.fillRequired"));
      return;
    }

    setShouldGoBack(false);
    createCardMutation.mutate({
      word: data.word.trim(),
      translation: data.translation.trim(),
      deckId: Number(id),
    });
  };

  const handleDismissAchievement = () => {
    setShowAchievementModal(false);

    if (shouldGoBack) {
      Alert.alert("✅ " + t("cards.addCard.success"));
      router.back();
    } else {
      reset();
      cardRef.current?.resetFlip();
      Alert.alert("✅ " + t("cards.addCard.success"));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Scanlines />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AddCardHeader onBack={() => router.back()} />

        <ScrollView
          className="flex-1 "
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
