import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../../Button";

type CreateDeckActionsProps = {
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
};

export default function CreateDeckActions({
  onSubmit,
  onCancel,
  isLoading,
}: CreateDeckActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={isLoading}
      >
        <Text style={styles.cancelButtonText}>
          {t("decks.createDeck.buttons.cancel")}
        </Text>
      </TouchableOpacity>

      <View style={styles.submitButtonContainer}>
        <Button
          title={t("decks.createDeck.buttons.create")}
          onPress={onSubmit}
          loading={isLoading}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonContainer: {
    flex: 2,
  },
});
