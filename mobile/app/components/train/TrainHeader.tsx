import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function TrainHeader() {
  const { t } = useTranslation();

  return (
    <View className="px-6 pt-16 pb-4">
      <Text className="text-foreground text-3xl font-black tracking-[4px]">
        {t("train.title").toUpperCase()}
      </Text>
      <Text className="text-accent text-xs font-bold tracking-[3px] mt-1">
        {t("train.subtitle").toUpperCase()}
      </Text>
    </View>
  );
}
