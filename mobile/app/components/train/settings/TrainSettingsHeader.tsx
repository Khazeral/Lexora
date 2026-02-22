import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type TrainSettingsHeaderProps = {
  onBack: () => void;
};

export default function TrainSettingsHeader({
  onBack,
}: TrainSettingsHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="px-6 pt-16 pb-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-4">
          <Text className="text-foreground text-2xl font-black tracking-[4px]">
            {t("train.trainSettings.title").toUpperCase()}
          </Text>
          <Text className="text-accent text-xs font-bold tracking-[3px] mt-1">
            {t("train.trainSettings.subtitle", "PARAMÈTRES").toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onBack}
          className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center mt-1"
          style={pillShadow.sm}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#e8edf5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
