import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

type HomeHeaderProps = {
  username: string;
};

export default function HomeHeader({ username }: HomeHeaderProps) {
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greetings.morning");
    if (hour < 18) return t("home.greetings.afternoon");
    return t("home.greetings.evening");
  };

  return (
    <LinearGradient
      colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{username} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/(tabs)/settings")}
        >
          <Ionicons name="person-circle-outline" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
    padding: 4,
  },
});
