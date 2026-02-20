import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GAME_MODES, GameMode } from "@/constants/gameMods";
import ClassicModeOptions from "./ClassicModeOptions";
import { pillShadow } from "@/app/components/ui/GlowStyles";

const MODE_COLORS: Record<
  string,
  { bg: string; icon: string; border: string }
> = {
  classic: { bg: "#1a3a5c", icon: "#5b8af5", border: "#5b8af5" },
  speedrun: { bg: "#3d1a1a", icon: "#e8453c", border: "#e8453c" },
  streak: { bg: "#0d3a3a", icon: "#06b6d4", border: "#06b6d4" },
  timeattack: { bg: "#2e1a3d", icon: "#a855f7", border: "#a855f7" },
  perfect: { bg: "#3d2e1a", icon: "#f5c542", border: "#f5c542" },
};

type GameModeSelectorProps = {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  shuffleCards?: boolean;
  reverseMode?: boolean;
  onShuffleChange?: (value: boolean) => void;
  onReverseChange?: (value: boolean) => void;
};

export default function GameModeSelector({
  selectedMode,
  onSelectMode,
  shuffleCards = false,
  reverseMode = false,
  onShuffleChange,
  onReverseChange,
}: GameModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <View className="px-6 mb-4">
      <Text className="text-foreground text-lg font-bold tracking-wider mb-1">
        {t("train.trainSettings.gameMode.title").toUpperCase()}
      </Text>
      <Text className="text-muted-foreground text-sm mb-4">
        {t("train.trainSettings.gameMode.subtitle")}
      </Text>

      {GAME_MODES.map((mode) => {
        const isSelected = selectedMode === mode.id;
        const colors = MODE_COLORS[mode.id] || {
          bg: "#1a3a5c",
          icon: "#5b8af5",
          border: "#5b8af5",
        };
        const isClassicSelected = mode.id === "classic" && isSelected;

        return (
          <View key={mode.id}>
            <TouchableOpacity
              className={`flex-row items-center p-4 bg-card border-2 ${
                isClassicSelected
                  ? "rounded-t-2xl rounded-b-none mb-0"
                  : "rounded-2xl mb-4"
              }`}
              style={[
                { borderColor: isSelected ? colors.border : "#2a7a60" },
                pillShadow.sm,
              ]}
              onPress={() => onSelectMode(mode.id)}
              activeOpacity={0.7}
            >
              <View
                className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.bg }}
              >
                <Ionicons
                  name={mode.icon as any}
                  size={28}
                  color={colors.icon}
                />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-foreground text-base font-bold tracking-wide flex-1">
                    {t(mode.title).toUpperCase()}
                  </Text>

                  <View
                    className="px-3 py-1 rounded-lg ml-2"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Text
                      className="text-[10px] font-bold tracking-wider"
                      style={{ color: colors.icon }}
                    >
                      {t(mode.difficulty).toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text className="text-muted-foreground text-xs leading-4">
                  {t(mode.description)}
                </Text>
              </View>

              {isSelected && (
                <View className="ml-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.icon}
                  />
                </View>
              )}
            </TouchableOpacity>

            {isClassicSelected && (
              <ClassicModeOptions
                shuffleCards={shuffleCards}
                reverseMode={reverseMode}
                onShuffleChange={onShuffleChange || (() => {})}
                onReverseChange={onReverseChange || (() => {})}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
