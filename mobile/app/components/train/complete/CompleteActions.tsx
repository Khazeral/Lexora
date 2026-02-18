import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type CompleteActionsProps = {
  deckId: string | string[];
};

export default function CompleteActions({ deckId }: CompleteActionsProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row gap-3 p-6 bg-secondary border-t-2 border-border">
      {/* Home Button */}
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-3 py-4 rounded-2xl bg-card border-2 border-border"
        style={pillShadow.sm}
        onPress={() => router.push("/(tabs)")}
        activeOpacity={0.7}
      >
        <Ionicons name="home" size={20} color="#6e9e8a" />
        <Text className="text-muted-foreground text-sm font-bold tracking-wider">
          HOME
        </Text>
      </TouchableOpacity>

      {/* Train Again Button */}
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-3 py-4 rounded-2xl"
        style={[{ backgroundColor: "#44d9a0" }, pillShadow.default]}
        onPress={() =>
          router.push({
            pathname: "/train/[id]/settings",
            params: { id: deckId },
          })
        }
        activeOpacity={0.8}
      >
        <Ionicons name="refresh" size={20} color="#0b3d2e" />
        <Text className="text-[#0b3d2e] text-sm font-bold tracking-wider">
          {t("trainComplete.actions.trainAgain").toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
