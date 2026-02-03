import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type AddCardHeaderProps = {
  onBack: () => void;
  onToggleTips: () => void;
  showingTips: boolean;
};

export default function AddCardHeader({
  onBack,
  onToggleTips,
  showingTips,
}: AddCardHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={28} color="#1e293b" />
      </TouchableOpacity>
      <Text style={styles.title}>{t("cards.addCard.title")}</Text>
      <TouchableOpacity
        onPress={onToggleTips}
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={showingTips ? "bulb" : "bulb-outline"}
          size={24}
          color={showingTips ? "#fbbf24" : "#64748b"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  button: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
});
