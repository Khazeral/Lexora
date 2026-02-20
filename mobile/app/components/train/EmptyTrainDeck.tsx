import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";

export default function EmptyTrainDecks() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center pt-12 px-8">
      <View
        className="w-28 h-28 rounded-3xl bg-card border-2 border-border items-center justify-center mb-6"
        style={pillShadow.card}
      >
        <View
          className="w-20 h-20 rounded-2xl bg-accent items-center justify-center"
          style={pillShadow.sm}
        >
          <Ionicons name="school" size={40} color="#0b3d2e" />
        </View>
      </View>

      <Text className="text-foreground text-xl font-bold tracking-wider text-center mb-2">
        {t("train.empty.title").toUpperCase()}
      </Text>

      <Text className="text-muted-foreground text-sm text-center leading-5 mb-8">
        {t("train.empty.subtitle")}
      </Text>

      <TouchableOpacity
        className="flex-row items-center gap-3 px-6 py-4 rounded-2xl"
        style={[pillShadow.default, { backgroundColor: pillColors.blue }]}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text className="text-white text-base font-bold tracking-wider">
          {t("train.empty.button").toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
