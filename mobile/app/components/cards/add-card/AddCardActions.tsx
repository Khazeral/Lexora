import { View, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Button from "../../../components/Button";

type AddCardActionsProps = {
  onAdd: () => void;
  onAddAnother: () => void;
  onCancel: () => void;
  isLoading: boolean;
};

export default function AddCardActions({
  onAdd,
  onAddAnother,
  onCancel,
  isLoading,
}: AddCardActionsProps) {
  const { t } = useTranslation();
  const [continueAdding, setContinueAdding] = useState(false);

  const handleSubmit = () => {
    if (continueAdding) {
      onAddAnother();
    } else {
      onAdd();
    }
  };

  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={() => setContinueAdding(!continueAdding)}
        activeOpacity={0.7}
      >
        <View style={styles.toggleContent}>
          <Ionicons
            name={continueAdding ? "repeat" : "checkmark-done"}
            size={20}
            color="#64748b"
          />
          <Text style={styles.toggleText}>
            {continueAdding
              ? t("cards.addCard.buttons.keepAdding")
              : t("cards.addCard.buttons.addAndClose")}
          </Text>
        </View>
        <Switch
          value={continueAdding}
          onValueChange={setContinueAdding}
          trackColor={{ false: "#cbd5e1", true: "#bfdbfe" }}
          thumbColor={continueAdding ? "#3b82f6" : "#f1f5f9"}
        />
      </TouchableOpacity>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>
            {t("cards.addCard.buttons.cancel")}
          </Text>
        </TouchableOpacity>

        <View style={styles.submitButtonContainer}>
          <Button
            title={t("cards.addCard.buttons.add")}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },
  submitButtonContainer: {
    flex: 1,
  },
});
