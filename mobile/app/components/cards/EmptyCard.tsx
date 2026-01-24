import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type EmptyCardsProps = {
  deckId: number;
};

export default function EmptyCard({ deckId }: EmptyCardsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="card-outline" size={48} color="#3b82f6" />
      </View>
      <Text style={styles.title}>{t("deckDetail.empty.title")}</Text>
      <Text style={styles.subtitle}>{t("deckDetail.empty.subtitle")}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/deck/${deckId}/add-card`)}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>{t("deckDetail.empty.button")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
