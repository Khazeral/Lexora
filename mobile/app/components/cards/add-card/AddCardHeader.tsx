import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type AddCardHeaderProps = {
  onBack: () => void;
};

export default function AddCardHeader({ onBack }: AddCardHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center px-6 py-4">
      <TouchableOpacity
        onPress={onBack}
        className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
        style={[pillShadow.sm, { zIndex: 10 }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color="#e8edf5" />
      </TouchableOpacity>

      <Text className="flex-1 text-foreground text-xl font-bold tracking-[2px] text-center -ml-12">
        {t("cards.addCard.title").toUpperCase()}
      </Text>
    </View>
  );
}
