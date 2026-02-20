import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUnseenCount } from "@/services/achievements.api";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";

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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-6 py-4 border-b-2 border-border">
        <Text className="text-foreground text-3xl font-bold tracking-wider">
          {t("profile.title").toUpperCase()}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-card rounded-2xl p-6 border-2 border-border items-center mb-6"
          style={pillShadow.card}
        >
          <View
            className="w-24 h-24 rounded-2xl bg-info items-center justify-center mb-4"
            style={pillShadow.default}
          >
            <Ionicons name="person" size={48} color="#fff" />
          </View>

          <Text className="text-foreground text-2xl font-bold tracking-wider mb-1">
            {user?.username?.toUpperCase()}
          </Text>
          <Text className="text-muted-foreground text-sm">{user?.email}</Text>
        </View>

        <TouchableOpacity
          className="bg-card rounded-2xl p-4 border-2 border-accent mb-4 flex-row items-center justify-between"
          style={pillShadow.card}
          onPress={() => router.push("/achievements")}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="w-14 h-14 rounded-xl bg-accent items-center justify-center"
              style={pillShadow.sm}
            >
              <Ionicons name="trophy" size={28} color="#0b3d2e" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold tracking-wider">
                {t("profile.achievements").toUpperCase()}
              </Text>
              <Text className="text-muted-foreground text-sm">
                {t("profile.achievementsSubtitle")}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {unseenCount > 0 && (
              <View
                className="min-w-[28px] h-7 rounded-full items-center justify-center px-2"
                style={{ backgroundColor: pillColors.red }}
              >
                <Text className="text-white text-xs font-bold">
                  {unseenCount}
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={24} color="#6e9e8a" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-card rounded-2xl p-4 border-2 border-border mb-4 flex-row items-center justify-between"
          style={pillShadow.card}
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="w-14 h-14 rounded-xl bg-info items-center justify-center"
              style={pillShadow.sm}
            >
              <Ionicons name="language" size={28} color="#fff" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold tracking-wider">
                {t("profile.language").toUpperCase()}
              </Text>
              <Text className="text-muted-foreground text-sm">
                {i18n.language === "fr" ? "Français" : "English"}
              </Text>
            </View>
          </View>

          <View className="flex-row bg-secondary rounded-xl p-1">
            <View
              className={`px-4 py-2 rounded-lg ${i18n.language === "fr" ? "bg-info" : ""}`}
              style={i18n.language === "fr" ? pillShadow.sm : undefined}
            >
              <Text
                className={`text-sm font-bold ${i18n.language === "fr" ? "text-white" : "text-muted-foreground"}`}
              >
                FR
              </Text>
            </View>
            <View
              className={`px-4 py-2 rounded-lg ${i18n.language === "en" ? "bg-info" : ""}`}
              style={i18n.language === "en" ? pillShadow.sm : undefined}
            >
              <Text
                className={`text-sm font-bold ${i18n.language === "en" ? "text-white" : "text-muted-foreground"}`}
              >
                EN
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-card rounded-2xl p-4 border-2 border-border mb-4 flex-row items-center justify-between"
          style={pillShadow.card}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="w-14 h-14 rounded-xl items-center justify-center"
              style={[pillShadow.sm, { backgroundColor: "#6e9e8a" }]}
            >
              <Ionicons name="settings" size={28} color="#fff" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold tracking-wider">
                SETTINGS
              </Text>
              <Text className="text-muted-foreground text-sm">
                App preferences
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#6e9e8a" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-card rounded-2xl p-4 border-2 border-border mb-6 flex-row items-center justify-between"
          style={pillShadow.card}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="w-14 h-14 rounded-xl items-center justify-center"
              style={[pillShadow.sm, { backgroundColor: "#8b5cf6" }]}
            >
              <Ionicons name="help-circle" size={28} color="#fff" />
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold tracking-wider">
                HELP
              </Text>
              <Text className="text-muted-foreground text-sm">
                FAQ & Support
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#6e9e8a" />
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-2xl p-4 flex-row items-center justify-center gap-3"
          style={[pillShadow.default, { backgroundColor: pillColors.red }]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text className="text-white text-base font-bold tracking-wider">
            {t("profile.logout").toUpperCase()}
          </Text>
        </TouchableOpacity>

        <Text className="text-muted-foreground text-xs text-center mt-6 tracking-wider">
          LEXORA v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
