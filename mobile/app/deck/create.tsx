import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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
import Toast from "../components/ui/Toast";
import ConfirmModal from "../components/ConfirmModal";

type CreateDeckFormData = {
  name: string;
  description?: string;
};

export default function CreateDeckScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showAchievementToast } = useToast();
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error" as "success" | "error" | "info",
  });
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
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
      setToast({
        visible: true,
        message: t("decks.createDeck.errors.createFailed"),
        type: "error",
      });
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
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.back();
    }
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
      <ConfirmModal
        visible={showCancelModal}
        title={t("decks.createDeck.cancelTitle", "Abandonner")}
        message={t(
          "decks.createDeck.cancelMessage",
          "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?",
        )}
        confirmText={t("common.quit", "Quitter")}
        cancelText={t("common.stay", "Rester")}
        type="warning"
        onConfirm={() => {
          setShowCancelModal(false);
          router.back();
        }}
        onCancel={() => setShowCancelModal(false)}
      />
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
