import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type CompleteActionsProps = {
  deckId: string | string[];
};

export default function CompleteActions({ deckId }: CompleteActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push(`/deck/${deckId}`)}
          activeOpacity={0.8}
        >
          <Ionicons name="albums" size={20} color="#3b82f6" />
          <Text style={styles.secondaryButtonText}>
            {t("trainComplete.actions.viewDeck")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/train/[id]/settings",
              params: { id: deckId },
            })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>
            {t("trainComplete.actions.trainAgain")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/(tabs)")}
        activeOpacity={0.7}
      >
        <Ionicons name="home" size={20} color="#64748b" />
        <Text style={styles.homeButtonText}>
          {t("trainComplete.actions.backToHome")}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  homeButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
});
