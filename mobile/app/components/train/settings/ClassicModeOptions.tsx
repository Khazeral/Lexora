import { View, Text, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type ClassicModeOptionsProps = {
  shuffleCards: boolean;
  reverseMode: boolean;
  onShuffleChange: (value: boolean) => void;
  onReverseChange: (value: boolean) => void;
};

export default function ClassicModeOptions({
  shuffleCards,
  reverseMode,
  onShuffleChange,
  onReverseChange,
}: ClassicModeOptionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="shuffle" size={18} color="#3b82f6" />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>
              {t("train.trainSettings.options.shuffle.title")}
            </Text>
            <Text style={styles.optionDescription}>
              {t("train.trainSettings.options.shuffle.description")}
            </Text>
          </View>
        </View>
        <Switch
          value={shuffleCards}
          onValueChange={onShuffleChange}
          trackColor={{ false: "#cbd5e1", true: "#bfdbfe" }}
          thumbColor={shuffleCards ? "#3b82f6" : "#f1f5f9"}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="swap-horizontal" size={18} color="#10b981" />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>
              {t("train.trainSettings.options.reverse.title")}
            </Text>
            <Text style={styles.optionDescription}>
              {t("train.trainSettings.options.reverse.description")}
            </Text>
          </View>
        </View>
        <Switch
          value={reverseMode}
          onValueChange={onReverseChange}
          trackColor={{ false: "#cbd5e1", true: "#a7f3d0" }}
          thumbColor={reverseMode ? "#10b981" : "#f1f5f9"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#3b82f6",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  optionDescription: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
});
