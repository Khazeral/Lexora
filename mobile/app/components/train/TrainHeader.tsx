import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function TrainHeader() {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={32} color="#3b82f6" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("train.title")}</Text>
          <Text style={styles.subtitle}>{t("train.subtitle")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 4,
  },
});
