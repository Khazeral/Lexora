import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type CreateDeckHeaderProps = {
  onBack: () => void;
};

export default function CreateDeckHeader({ onBack }: CreateDeckHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between px-6 pt-8 pb-4">
      <TouchableOpacity
        onPress={onBack}
        className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
        style={pillShadow.sm}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color="#e8edf5" />
      </TouchableOpacity>

      <Text className="text-foreground text-lg font-bold tracking-wider">
        {t("decks.createDeck.title").toUpperCase()}
      </Text>

      <View className="w-12" />
    </View>
  );
}
