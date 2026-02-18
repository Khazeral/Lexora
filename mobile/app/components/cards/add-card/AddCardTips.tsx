import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

export default function AddCardTips() {
  const { t } = useTranslation();

  const tips = [
    { icon: "checkmark-circle", text: t("cards.addCard.tips.tip1") },
    { icon: "bulb", text: t("cards.addCard.tips.tip2") },
    { icon: "information-circle", text: t("cards.addCard.tips.tip3") },
  ];

  return (
    <View
      className="bg-card rounded-2xl p-4 mb-6 border-2 border-accent"
      style={pillShadow.sm}
    >
      <View className="flex-row items-center gap-2 mb-3">
        <View
          className="w-8 h-8 rounded-lg bg-accent items-center justify-center"
          style={pillShadow.sm}
        >
          <Ionicons name="bulb" size={18} color="#0b3d2e" />
        </View>
        <Text className="text-accent text-sm font-bold tracking-wider">
          {t("cards.addCard.tips.title").toUpperCase()}
        </Text>
      </View>

      <View className="gap-3">
        {tips.map((tip, index) => (
          <View key={index} className="flex-row items-start gap-3">
            <Ionicons name={tip.icon as any} size={16} color="#f5c542" />
            <Text className="flex-1 text-foreground text-sm leading-5">
              {tip.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
