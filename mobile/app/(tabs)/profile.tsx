import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { getUnseenCount } from "@/services/achievements.api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const { data: unseenData } = useQuery({
    queryKey: ["achievements-unseen"],
    queryFn: getUnseenCount,
  });

  const unseenCount = unseenData?.count || 0;

  const toggleLanguage = () => {
    const newLang = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("profile.title")}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#3b82f6" />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.achievementsCard}
          onPress={() => router.push("/achievements")}
        >
          <View style={styles.achievementsLeft}>
            <View style={styles.achievementsIcon}>
              <Ionicons name="trophy" size={28} color="#fbbf24" />
            </View>
            <View>
              <Text style={styles.achievementsTitle}>
                {t("profile.achievements")}
              </Text>
              <Text style={styles.achievementsSubtitle}>
                {t("profile.achievementsSubtitle")}
              </Text>
            </View>
          </View>
          <View style={styles.achievementsRight}>
            {unseenCount > 0 && (
              <View style={styles.unseenBadge}>
                <Text style={styles.unseenBadgeText}>{unseenCount}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.languageCard} onPress={toggleLanguage}>
          <View style={styles.languageLeft}>
            <View style={styles.languageIcon}>
              <Ionicons name="language" size={28} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.languageTitle}>{t("profile.language")}</Text>
              <Text style={styles.languageSubtitle}>
                {i18n.language === "fr" ? "Français" : "English"}
              </Text>
            </View>
          </View>
          <View style={styles.languageSwitch}>
            <View
              style={[
                styles.languageOption,
                i18n.language === "fr" && styles.languageOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  i18n.language === "fr" && styles.languageOptionTextActive,
                ]}
              >
                FR
              </Text>
            </View>
            <View
              style={[
                styles.languageOption,
                i18n.language === "en" && styles.languageOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  i18n.language === "en" && styles.languageOptionTextActive,
                ]}
              >
                EN
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#64748b",
  },
  achievementsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  achievementsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  achievementsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef9c3",
    justifyContent: "center",
    alignItems: "center",
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  achievementsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unseenBadge: {
    backgroundColor: "#ef4444",
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unseenBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  languageCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  languageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  languageSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  languageSwitch: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 4,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  languageOptionActive: {
    backgroundColor: "#3b82f6",
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  languageOptionTextActive: {
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
