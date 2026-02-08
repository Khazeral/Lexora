import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Mode = {
  title: string;
  color: string;
};

type StartTrainingButtonProps = {
  mode: Mode;
  onStart: () => void;
  disabled?: boolean;
};

export const StartTrainingButton = ({
  mode,
  onStart,
  disabled = false,
}: StartTrainingButtonProps) => {
  const { t } = useTranslation();

  const modeTitle = t(mode.title);

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: mode.color },
          disabled && styles.buttonDisabled,
        ]}
        onPress={onStart}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {t("train.trainSettings.start", { mode: modeTitle })}
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
