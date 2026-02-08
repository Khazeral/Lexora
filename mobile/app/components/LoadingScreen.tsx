import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LoadingScreenProps = {
  loading?: boolean;
  notFound?: boolean;
  notFoundMessage?: string;
  notFoundIcon?: keyof typeof Ionicons.glyphMap;
};

export default function LoadingScreen({
  loading = true,
  notFound = false,
  notFoundMessage = "Not found",
  notFoundIcon = "alert-circle-outline",
}: LoadingScreenProps) {
  if (notFound) {
    return (
      <View style={styles.container}>
        <Ionicons name={notFoundIcon} size={64} color="#cbd5e1" />
        <Text style={styles.notFoundText}>{notFoundMessage}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    gap: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
});
