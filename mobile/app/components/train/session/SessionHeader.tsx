import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type SessionHeaderProps = {
  deckName: string;
  isReverse: boolean;
  onClose: () => void;
};

export default function SessionHeader({
  deckName,
  isReverse,
  onClose,
}: SessionHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="#1e293b" />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {deckName}
        </Text>
        {isReverse && (
          <View style={styles.reverseBadge}>
            <Ionicons name="swap-horizontal" size={12} color="#10b981" />
            <Text style={styles.reverseBadgeText}>
              {t("trainSession.header.reverse")}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  reverseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  reverseBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10b981",
  },
  placeholder: {
    width: 40,
  },
});
