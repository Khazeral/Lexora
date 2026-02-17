import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    {
      icon: "add-circle",
      label: t("home.quickActions.newDeck"),
      color: "#3b82f6",
      bgColor: "#eff6ff",
      onPress: () => router.push("/deck/create"),
    },
    {
      icon: "play-circle",
      label: t("home.quickActions.practice"),
      color: "#10b981",
      bgColor: "#d1fae5",
      onPress: () => router.push("/(tabs)/train"),
    },
    {
      icon: "trophy",
      label: t("home.quickActions.achievements"),
      color: "#f59e0b",
      bgColor: "#fef3c7",
      onPress: () => router.push("/achievements"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t("home.quickActions.title")}</Text>
      <View style={styles.actionsRow}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: action.bgColor }]}
            >
              <Ionicons
                name={action.icon as any}
                size={28}
                color={action.color}
              />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
});
