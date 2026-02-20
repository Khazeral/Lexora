import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function DecksHeader() {
  const { t } = useTranslation();

  return (
    <View className="px-6 pt-16 pb-4">
      <Text className="text-foreground text-3xl font-black tracking-[4px]">
        {t("decks.title").toUpperCase()}
      </Text>
      <Text className="text-accent text-xs font-bold tracking-[3px] mt-1">
        {t("decks.description").toUpperCase()}
      </Text>

      <View className="h-[2px] bg-border mt-4" />
    </View>
  );
}
