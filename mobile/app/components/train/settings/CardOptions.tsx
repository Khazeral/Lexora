import { View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type CardOptionsProps = {
  shuffleCards: boolean;
  reverseMode: boolean;
  onShuffleChange: (value: boolean) => void;
  onReverseChange: (value: boolean) => void;
};

export default function CardOptions({
  shuffleCards,
  reverseMode,
  onShuffleChange,
  onReverseChange,
}: CardOptionsProps) {
  const { t } = useTranslation();

  return (
    <View className="px-6 mb-6">
      <Text className="text-foreground text-lg font-bold tracking-wider mb-1">
        {t("train.trainSettings.options.title", "OPTIONS").toUpperCase()}
      </Text>
      <Text className="text-muted-foreground text-sm mb-4">
        {t(
          "train.trainSettings.options.subtitle",
          "Personnalisez votre session",
        )}
      </Text>

      <View
        className="bg-card rounded-2xl border-2 border-border p-4"
        style={pillShadow.sm}
      >
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center flex-1 gap-3">
            <View
              className="w-10 h-10 rounded-xl bg-secondary border-2 border-border items-center justify-center"
              style={pillShadow.sm}
            >
              <Ionicons name="shuffle" size={18} color="#5b8af5" />
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-sm font-semibold">
                {t("train.trainSettings.options.shuffle.title")}
              </Text>
              <Text className="text-muted-foreground text-xs mt-0.5">
                {t("train.trainSettings.options.shuffle.description")}
              </Text>
            </View>
          </View>
          <Switch
            value={shuffleCards}
            onValueChange={onShuffleChange}
            trackColor={{ false: "#0a1f18", true: "#1a3a5c" }}
            thumbColor={shuffleCards ? "#5b8af5" : "#6e9e8a"}
            ios_backgroundColor="#0a1f18"
          />
        </View>

        <View className="h-px bg-border my-3" />

        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center flex-1 gap-3">
            <View
              className="w-10 h-10 rounded-xl bg-secondary border-2 border-border items-center justify-center"
              style={pillShadow.sm}
            >
              <Ionicons name="swap-horizontal" size={18} color="#44d9a0" />
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-sm font-semibold">
                {t("train.trainSettings.options.reverse.title")}
              </Text>
              <Text className="text-muted-foreground text-xs mt-0.5">
                {t("train.trainSettings.options.reverse.description")}
              </Text>
            </View>
          </View>
          <Switch
            value={reverseMode}
            onValueChange={onReverseChange}
            trackColor={{ false: "#0a1f18", true: "#1a3d2e" }}
            thumbColor={reverseMode ? "#44d9a0" : "#6e9e8a"}
            ios_backgroundColor="#0a1f18"
          />
        </View>
      </View>
    </View>
  );
}
