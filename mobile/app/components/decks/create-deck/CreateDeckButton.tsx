import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";

export default function CreateDeckButton() {
  const { t } = useTranslation();

  return (
    <Link href="/deck/create" asChild>
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>{t("decks.create")}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
