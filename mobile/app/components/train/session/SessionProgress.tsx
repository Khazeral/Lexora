import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GameMode } from "@/constants/gameMods";

type SessionProgressProps = {
  currentIndex: number;
  totalCards: number;
  gameMode: GameMode;
  elapsedTime?: number;
  timePenalty?: number;
  lives?: number;
  cardTimeLeft?: number;
};

export default function SessionProgress({
  currentIndex,
  totalCards,
  gameMode,
  elapsedTime = 0,
  timePenalty = 0,
  lives = 3,
  cardTimeLeft = 10,
}: SessionProgressProps) {
  const { t } = useTranslation();
  const progress = ((currentIndex + 1) / totalCards) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {t("trainSession.progress.of", {
            current: currentIndex + 1,
            total: totalCards,
          })}
        </Text>

        {gameMode === "speedrun" && (
          <View style={styles.modeIndicator}>
            <Ionicons name="flash" size={16} color="#f59e0b" />
            <Text style={[styles.modeIndicatorText, { color: "#f59e0b" }]}>
              {Math.floor((elapsedTime + timePenalty) / 60)}:
              {((elapsedTime + timePenalty) % 60).toString().padStart(2, "0")}
            </Text>
            {timePenalty > 0 && (
              <Text style={styles.penaltyText}>
                {t("trainSession.modes.speedrun.penalty", {
                  seconds: timePenalty,
                })}
              </Text>
            )}
          </View>
        )}

        {gameMode === "streak" && (
          <View style={styles.modeIndicator}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < lives ? "heart" : "heart-outline"}
                size={20}
                color={i < lives ? "#ef4444" : "#cbd5e1"}
              />
            ))}
          </View>
        )}

        {gameMode === "timeattack" && (
          <View
            style={[
              styles.modeIndicator,
              cardTimeLeft <= 3 && styles.modeIndicatorUrgent,
            ]}
          >
            <Ionicons
              name="timer"
              size={16}
              color={cardTimeLeft <= 3 ? "#ef4444" : "#8b5cf6"}
            />
            <Text
              style={[
                styles.modeIndicatorText,
                { color: cardTimeLeft <= 3 ? "#ef4444" : "#8b5cf6" },
              ]}
            >
              {cardTimeLeft}s
            </Text>
          </View>
        )}

        {gameMode === "perfect" && (
          <View style={styles.modeIndicator}>
            <Ionicons name="diamond" size={16} color="#ec4899" />
            <Text style={[styles.modeIndicatorText, { color: "#ec4899" }]}>
              {t("trainSession.modes.perfect")}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  modeIndicatorUrgent: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
  },
  modeIndicatorText: {
    fontSize: 14,
    fontWeight: "700",
  },
  penaltyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
});
