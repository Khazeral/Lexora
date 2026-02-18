import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import { GameMode } from "@/constants/gameMods";

// Mêmes couleurs que GameModeSelector
const MODE_BUTTON_COLORS: Record<string, string> = {
  classic: "#5b8af5",
  speedrun: "#e8453c",
  streak: "#06b6d4",
  timeattack: "#a855f7",
  perfect: "#f5c542",
};

type Mode = {
  id: GameMode;
  title: string;
  color: string;
};

type StartTrainingButtonProps = {
  mode: Mode;
  onStart: () => void;
  disabled?: boolean;
};

export function StartTrainingButton({
  mode,
  onStart,
  disabled = false,
}: StartTrainingButtonProps) {
  const { t } = useTranslation();
  const modeTitle = t(mode.title);

  // Utiliser la couleur du mode
  const buttonColor = MODE_BUTTON_COLORS[mode.id] || "#5b8af5";

  return (
    <View className="p-6 bg-secondary border-t-2 border-border">
      <TouchableOpacity
        className={`flex-row items-center justify-center gap-3 py-5 rounded-2xl ${
          disabled ? "opacity-50" : ""
        }`}
        style={[{ backgroundColor: buttonColor }, pillShadow.default]}
        onPress={onStart}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text className="text-white text-base font-bold tracking-wider">
          {t("train.trainSettings.start", { mode: modeTitle }).toUpperCase()}
        </Text>
        <Ionicons name="arrow-forward" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
