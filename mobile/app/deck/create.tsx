import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createDeck } from "@/services/decks.api";
import { useToast } from "@/services/toast_context";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateDeckActions from "../components/decks/create-deck/CreateDeckActions";
import CreateDeckForm from "../components/decks/create-deck/CreateDeckForm";
import CreateDeckHeader from "../components/decks/create-deck/CreateDeckHeader";
import Scanlines from "../components/Scanlines";

type CreateDeckFormData = {
  name: string;
  description?: string;
};

export default function CreateDeckScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showAchievementToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDeckFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createDeckMutation = useMutation({
    mutationFn: createDeck,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });

      if (
        response.unlockedAchievements &&
        response.unlockedAchievements.length > 0
      ) {
        showAchievementToast(response.unlockedAchievements.length);
      }

      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", t("decks.createDeck.errors.createFailed"));
      console.error(error);
    },
  });

  const onSubmit = (data: CreateDeckFormData) => {
    createDeckMutation.mutate({
      name: data.name.trim(),
      description: data.description?.trim(),
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Scanlines />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <CreateDeckHeader onBack={handleCancel} />

        <ScrollView
          className="flex-1"
          contentContainerClassName="p-6 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CreateDeckForm control={control} errors={errors} />
        </ScrollView>

        <CreateDeckActions
          onSubmit={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          isLoading={createDeckMutation.isPending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
