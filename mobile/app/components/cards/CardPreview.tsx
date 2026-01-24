import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type CardPreviewProps = {
  word: string;
  translation: string;
};

export default function CardPreview({ word, translation }: CardPreviewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="eye-outline" size={18} color="#64748b" />
        <Text style={styles.title}>{t("cards.addCard.form.previewTitle")}</Text>
      </View>

      <View style={styles.previewCard}>
        <View style={styles.cardSide}>
          <Text style={styles.sideLabel}>{t("cards.addCard.form.front")}</Text>
          <Text style={styles.sideContent}>
            {word || t("cards.addCard.form.empty")}
          </Text>
        </View>

        <View style={styles.flipIndicator}>
          <View style={styles.flipLine} />
          <View style={styles.flipIcon}>
            <Ionicons name="swap-vertical" size={16} color="#94a3b8" />
          </View>
          <View style={styles.flipLine} />
        </View>

        <View style={styles.cardSide}>
          <Text style={styles.sideLabel}>{t("cards.addCard.form.back")}</Text>
          <Text style={styles.sideContent}>
            {translation || t("cards.addCard.form.empty")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSide: {
    gap: 8,
  },
  sideLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sideContent: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    minHeight: 28,
  },
  flipIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 8,
  },
  flipLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  flipIcon: {
    backgroundColor: "#f8fafc",
    padding: 4,
    borderRadius: 20,
  },
});
