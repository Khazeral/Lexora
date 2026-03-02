import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import AnimatedTouchable from "../../ui/AnimatedTouchable";

type DeckActionsProps = {
  deckId: number;
};

export default function DeckActions({ deckId }: DeckActionsProps) {
  const { t } = useTranslation();

  return (
    <View className="absolute right-6 bottom-6 gap-3 items-end">
      <AnimatedTouchable
        className="flex-row items-center gap-2 px-6 py-4 rounded-2xl bg-info"
        style={pillShadow.default}
        onPress={() => router.push(`/deck/${deckId}/add-card`)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text className="text-white text-base font-bold tracking-wider">
          {t("decks.deckDetail.addCard").toUpperCase()}
        </Text>
      </AnimatedTouchable>
    </View>
  );
}
