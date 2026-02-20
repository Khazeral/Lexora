import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

export default function TrainHeader() {
  const { t } = useTranslation();

  return (
    <View className="border-b-2 border-border px-6 py-5">
      <View className="flex-row items-center gap-4">
        <View
          className="w-16 h-16 rounded-2xl bg-accent items-center justify-center"
          style={pillShadow.default}
        >
          <Ionicons name="school" size={32} color="#0b3d2e" />
        </View>

        <View className="flex-1">
          <Text className="text-foreground text-2xl font-bold tracking-wider">
            {t("train.title").toUpperCase()}
          </Text>
          <Text className="text-muted-foreground text-sm mt-1">
            {t("train.subtitle")}
          </Text>
        </View>
      </View>
    </View>
  );
}
