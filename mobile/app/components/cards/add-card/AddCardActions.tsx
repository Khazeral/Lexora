import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type AddCardActionsProps = {
  onAdd: () => void;
  onAddAnother: () => void;
  isLoading: boolean;
};

export default function AddCardActions({
  onAdd,
  onAddAnother,
  isLoading,
}: AddCardActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.actions}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={onAddAnother}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#3b82f6" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text style={styles.secondaryButtonText}>
                {t("cards.addCard.buttons.addAnother")}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={onAdd}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {t("cards.addCard.buttons.addAndFinish")}
            </Text>
          )}
        </TouchableOpacity>
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
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: "#eff6ff",
    borderWidth: 2,
    borderColor: "#bfdbfe",
  },
  secondaryButtonText: {
    color: "#3b82f6",
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
