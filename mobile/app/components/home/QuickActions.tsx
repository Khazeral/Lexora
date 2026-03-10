import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    {
      icon: "add-circle" as const,
      label: t("home.quickActions.newDeck"),
      bgColor: "bg-primary/20",
      iconColor: "#5b8af5",
      onPress: () => router.push("/deck/create"),
    },
    {
      icon: "play-circle" as const,
      label: t("home.quickActions.practice"),
      bgColor: "bg-success/20",
      iconColor: "#44d9a0",
      onPress: () => router.push("/(tabs)/train"),
    },
    {
      icon: "trophy" as const,
      label: t("home.quickActions.achievements"),
      bgColor: "bg-accent/20",
      iconColor: "#f5c542",
      onPress: () => router.push("/achievements"),
    },
  ];

  return (
    <View className="mt-6 px-5">
      <Text className="text-[10px] font-bold text-muted-foreground tracking-[3px] mb-3">
        {t("home.quickActions.title").toUpperCase()}
      </Text>
      <View className="flex-row gap-3">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            className="flex-1 bg-card rounded-xl p-4 items-center border-2 border-border"
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View
              className={`w-12 h-12 rounded-xl ${action.bgColor} items-center justify-center mb-2`}
            >
              <Ionicons name={action.icon} size={28} color={action.iconColor} />
            </View>
            <Text className="text-foreground text-xs font-bold text-center">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
