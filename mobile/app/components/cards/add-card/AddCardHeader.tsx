import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type AddCardHeaderProps = {
  onBack: () => void;
  onToggleTips: () => void;
  showingTips: boolean;
};

export default function AddCardHeader({
  onBack,
  onToggleTips,
  showingTips,
}: AddCardHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b-2 border-border">
      {/* Close Button */}
      <TouchableOpacity
        onPress={onBack}
        className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
        style={pillShadow.sm}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color="#e8edf5" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-foreground text-lg font-bold tracking-wider">
        {t("cards.addCard.title").toUpperCase()}
      </Text>

      {/* Tips Button */}
      <TouchableOpacity
        onPress={onToggleTips}
        className={`w-12 h-12 rounded-xl border-2 items-center justify-center ${
          showingTips ? "bg-accent border-accent" : "bg-card border-border"
        }`}
        style={pillShadow.sm}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={showingTips ? "bulb" : "bulb-outline"}
          size={22}
          color={showingTips ? "#0b3d2e" : "#6e9e8a"}
        />
      </TouchableOpacity>
    </View>
  );
}
