import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GameMode } from "@/constants/gameMods";
import { pillShadow } from "@/app/components/ui/GlowStyles";

const MODE_COLORS: Record<string, { icon: string; bg: string }> = {
  classic: { icon: "#5b8af5", bg: "#1a3a5c" },
  speedrun: { icon: "#e8453c", bg: "#3d1a1a" },
  streak: { icon: "#06b6d4", bg: "#0d3a3a" },
  timeattack: { icon: "#a855f7", bg: "#2e1a3d" },
  perfect: { icon: "#f5c542", bg: "#3d2e1a" },
};

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
  const colors = MODE_COLORS[gameMode] || MODE_COLORS.classic;

  return (
    <View className="px-6 py-4 bg-secondary border-b-2 border-border">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-foreground text-base font-bold">
          {currentIndex + 1}
          <Text className="text-muted-foreground font-normal">
            {" "}
            / {totalCards}
          </Text>
        </Text>

        {gameMode === "speedrun" && (
          <View
            className="flex-row items-center gap-2 px-4 py-2 rounded-xl border-2"
            style={[
              { backgroundColor: colors.bg, borderColor: colors.icon },
              pillShadow.sm,
            ]}
          >
            <Ionicons name="flash" size={18} color={colors.icon} />
            <Text
              style={{ color: colors.icon }}
              className="text-base font-bold"
            >
              {Math.floor((elapsedTime + timePenalty) / 60)}:
              {((elapsedTime + timePenalty) % 60).toString().padStart(2, "0")}
            </Text>
            {timePenalty > 0 && (
              <Text className="text-destructive text-xs font-bold ml-1">
                +{timePenalty}s
              </Text>
            )}
          </View>
        )}

        {gameMode === "streak" && (
          <View
            className="flex-row items-center gap-1 px-4 py-2 rounded-xl border-2"
            style={[
              { backgroundColor: colors.bg, borderColor: colors.icon },
              pillShadow.sm,
            ]}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < lives ? "heart" : "heart-outline"}
                size={22}
                color={i < lives ? "#e8453c" : "#4a7a6a"}
              />
            ))}
          </View>
        )}

        {gameMode === "timeattack" && (
          <View
            className={`flex-row items-center gap-2 px-4 py-2 rounded-xl border-2`}
            style={[
              {
                backgroundColor: cardTimeLeft <= 3 ? "#3d1a1a" : colors.bg,
                borderColor: cardTimeLeft <= 3 ? "#e8453c" : colors.icon,
              },
              pillShadow.sm,
            ]}
          >
            <Ionicons
              name="timer"
              size={18}
              color={cardTimeLeft <= 3 ? "#e8453c" : colors.icon}
            />
            <Text
              className="text-base font-bold"
              style={{ color: cardTimeLeft <= 3 ? "#e8453c" : colors.icon }}
            >
              {cardTimeLeft}s
            </Text>
          </View>
        )}

        {gameMode === "perfect" && (
          <View
            className="flex-row items-center gap-2 px-4 py-2 rounded-xl border-2"
            style={[
              { backgroundColor: colors.bg, borderColor: colors.icon },
              pillShadow.sm,
            ]}
          >
            <Ionicons name="diamond" size={18} color={colors.icon} />
            <Text style={{ color: colors.icon }} className="text-sm font-bold">
              {t("trainSession.modes.perfect").toUpperCase()}
            </Text>
          </View>
        )}

        {gameMode === "classic" && (
          <View
            className="flex-row items-center gap-2 px-4 py-2 rounded-xl border-2"
            style={[{ backgroundColor: colors.bg, borderColor: colors.icon }]}
          >
            <Ionicons name="albums" size={18} color={colors.icon} />
            <Text style={{ color: colors.icon }} className="text-sm font-bold">
              CLASSIC
            </Text>
          </View>
        )}
      </View>

      <View className="h-3 bg-badge-dark rounded-full overflow-hidden border border-border">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: colors.icon,
          }}
        />
      </View>
    </View>
  );
}
