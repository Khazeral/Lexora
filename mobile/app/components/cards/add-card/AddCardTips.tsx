import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function AddCardTips() {
  const { t } = useTranslation();

  const tips = [
    { icon: "checkmark-circle", text: t("cards.addCard.tips.tip1") },
    { icon: "bulb", text: t("cards.addCard.tips.tip2") },
    { icon: "information-circle", text: t("cards.addCard.tips.tip3") },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("cards.addCard.tips.title")}</Text>
      <View style={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tip}>
            <Ionicons name={tip.icon as any} size={18} color="#fbbf24" />
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 12,
  },
  tipsContainer: {
    gap: 10,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#78350f",
    lineHeight: 18,
  },
});
