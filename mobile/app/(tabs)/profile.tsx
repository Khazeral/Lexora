import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { getUnseenCount } from "@/services/achievements.api";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";
import Scanlines from "../components/Scanlines";
import AnimatedTouchable from "../components/ui/AnimatedTouchable";

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
    <View className="flex-1 bg-background">
      <Scanlines />
      <View className="px-6 pt-16 pb-4">
        <Text className="text-foreground text-3xl font-black tracking-[4px]">
          {t("profile.title").toUpperCase()}
        </Text>
        <Text className="text-accent text-xs font-bold tracking-[3px] mt-1">
          {t("profile.subtitle", "VOTRE PROFIL").toUpperCase()}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-card rounded-2xl p-6 border-2 border-border items-center mb-6">
          <View className="w-24 h-24 rounded-2xl bg-info items-center justify-center mb-4">
            <Ionicons name="person" size={48} color="#fff" />
          </View>

          <Text className="text-foreground text-2xl font-bold tracking-wider mb-1">
            {user?.username?.toUpperCase()}
          </Text>
          <Text className="text-muted-foreground text-sm">{user?.email}</Text>
        </View>

        <AnimatedTouchable
          className="bg-card rounded-2xl p-4 border-2 border-accent mb-4 flex-row items-center justify-between"
          style={pillShadow.card}
          onPress={() => router.push("/achievements")}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-xl bg-accent items-center justify-center">
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
        </AnimatedTouchable>

        <TouchableOpacity
          className="bg-card rounded-2xl p-4 border-2 border-border mb-4 flex-row items-center justify-between"
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-xl bg-info items-center justify-center">
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
      </ScrollView>

      <View className="px-6 pb-28 pt-4">
        <AnimatedTouchable
          className="rounded-2xl p-4 flex-row items-center justify-center gap-3"
          style={[pillShadow.default, { backgroundColor: pillColors.red }]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text className="text-white text-base font-bold tracking-wider">
            {t("profile.logout").toUpperCase()}
          </Text>
        </AnimatedTouchable>

        <Text className="text-muted-foreground text-xs text-center mt-4 tracking-wider">
          LEXORA v1.0.0
        </Text>
      </View>
    </View>
  );
}
