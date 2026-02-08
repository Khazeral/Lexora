import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GAME_MODES, GameMode } from "@/constants/gameMods";
import ClassicModeOptions from "./ClassicModeOptions";

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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("train.trainSettings.gameMode.title")}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {t("train.trainSettings.gameMode.subtitle")}
      </Text>

      {GAME_MODES.map((mode) => (
        <View key={mode.id}>
          <TouchableOpacity
            style={[
              styles.modeCard,
              selectedMode === mode.id && styles.modeCardActive,
              mode.id === "classic" &&
                selectedMode === "classic" &&
                styles.modeCardClassicActive,
              {
                borderColor:
                  selectedMode === mode.id ? mode.color : "transparent",
              },
            ]}
            onPress={() => onSelectMode(mode.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.modeIcon, { backgroundColor: mode.bgColor }]}>
              <Ionicons name={mode.icon as any} size={28} color={mode.color} />
            </View>

            <View style={styles.modeContent}>
              <View style={styles.modeTitleRow}>
                <Text style={styles.modeTitle}>{t(mode.title)}</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: mode.bgColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: mode.difficultyColor },
                    ]}
                  >
                    {t(mode.difficulty)}
                  </Text>
                </View>
              </View>
              <Text style={styles.modeDescription}>{t(mode.description)}</Text>
            </View>

            {selectedMode === mode.id && (
              <Ionicons name="checkmark-circle" size={24} color={mode.color} />
            )}
          </TouchableOpacity>

          {mode.id === "classic" && selectedMode === "classic" && (
            <ClassicModeOptions
              shuffleCards={shuffleCards}
              reverseMode={reverseMode}
              onShuffleChange={onShuffleChange || (() => {})}
              onReverseChange={onReverseChange || (() => {})}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  modeCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  modeCardActive: {
    shadowOpacity: 0.15,
    elevation: 6,
  },
  modeCardClassicActive: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modeIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  modeContent: {
    flex: 1,
  },
  modeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modeDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
});
