import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type CardContentProps = {
  label: string;
  text: string;
  textColor: string;
  subtextColor: string;
  showTapHint?: boolean;
  showSwipeHints?: boolean;
};

export function CardFrontContent({
  label,
  text,
  textColor,
  subtextColor,
}: Omit<CardContentProps, "showSwipeHints">) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={[styles.cardLabel, { color: subtextColor }]}>{label}</Text>
      <Text style={[styles.cardText, { color: textColor }]}>{text}</Text>
      <View style={styles.tapHint}>
        <Ionicons name="hand-left" size={20} color={subtextColor} />
        <Text style={[styles.tapHintText, { color: subtextColor }]}>
          {t("trainSession.card.hints.tapToFlip")}
        </Text>
      </View>
    </>
  );
}

export function CardBackContent({
  label,
  text,
}: Pick<CardContentProps, "label" | "text">) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={[styles.cardLabel, styles.cardLabelBack]}>{label}</Text>
      <Text style={[styles.cardText, styles.cardTextBack]}>{text}</Text>
      <View style={styles.swipeHint}>
        <View style={styles.swipeHintItem}>
          <Ionicons name="arrow-back" size={16} color="#ef4444" />
          <Text style={styles.swipeHintText}>
            {t("trainSession.card.hints.swipeWrong")}
          </Text>
        </View>
        <View style={styles.swipeHintItem}>
          <Text style={styles.swipeHintText}>
            {t("trainSession.card.hints.swipeCorrect")}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#22c55e" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    alignSelf: "center",
    marginBottom: 24,
  },
  cardLabelBack: {
    color: "#bfdbfe",
  },
  cardText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  cardTextBack: {
    color: "#fff",
  },
  tapHint: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
  },
  tapHintText: {
    fontSize: 14,
  },
  swipeHint: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  swipeHintItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  swipeHintText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
});
