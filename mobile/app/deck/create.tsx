import React from "react";
import {
  StyleSheet,
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
import { SafeAreaView } from "react-native-safe-area-context";
import CreateDeckActions from "../components/decks/create-deck/CreateDeckActions";
import CreateDeckForm from "../components/decks/create-deck/CreateDeckForm";
import CreateDeckHeader from "../components/decks/create-deck/CreateDeckHeader";

type CreateDeckFormData = {
  name: string;
  description?: string;
};

export default function CreateDeckScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <CreateDeckHeader onBack={handleCancel} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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
