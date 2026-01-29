import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type DeckRecords = {
  bestSpeedRunTime: number | null;
  speedRunAttempts: number;
  bestStreak: number;
  bestAvgTimePerCard: number | null;
  timeAttackAttempts: number;
  perfectRunsCompleted: number;
  perfectRunAttempts: number;
};

type ModeStatsParams = {
  gameMode: string;
  deckRecords: DeckRecords | undefined;
  sessionCorrect: number;
  sessionIncorrect: number;
  bestStreak: number;
  speedRunTime: number;
  speedRunPenalty: number;
  totalCards: number;
  currentLives: number;
  wasPerfect: boolean;
};

export default function useModeStats({
  gameMode,
  deckRecords,
  sessionCorrect,
  sessionIncorrect,
  bestStreak,
  speedRunTime,
  speedRunPenalty,
  totalCards,
  currentLives,
  wasPerfect,
}: ModeStatsParams) {
  const { t } = useTranslation();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  let isFirstRun = !deckRecords;

  return useMemo(() => {
    switch (gameMode) {
      case "speedrun": {
        if (isFirstRun) {
          return {
            title: t("trainComplete.modes.speedrun.firstRun"),
            mainValue: formatTime(speedRunTime),
            mainLabel: t("trainComplete.modes.speedrun.yourTime"),
            subtitle: t("trainComplete.modes.speedrun.firstRunSubtitle"),
            color: "#f59e0b",
            icon: "flash" as const,
            isRecord: true,
            stats: [
              {
                label: t("trainComplete.modes.speedrun.penalties"),
                value: `+${speedRunPenalty}s`,
                icon: "warning" as const,
              },
              {
                label: t("trainComplete.modes.speedrun.netTime"),
                value: formatTime(speedRunTime - speedRunPenalty),
                icon: "timer" as const,
              },
            ],
          };
        }

        const diff = speedRunTime - deckRecords.bestSpeedRunTime;
        const isNewRecord = diff < 0;

        return {
          title: isNewRecord
            ? t("trainComplete.modes.speedrun.newRecord")
            : t("trainComplete.modes.speedrun.complete"),
          mainValue: formatTime(speedRunTime),
          mainLabel: t("trainComplete.modes.speedrun.yourTime"),
          subtitle: isNewRecord
            ? t("trainComplete.modes.speedrun.beatRecord", {
                seconds: Math.abs(diff),
              })
            : t("trainComplete.modes.speedrun.slower", { seconds: diff }),
          color: isNewRecord ? "#10b981" : "#f59e0b",
          icon: "flash" as const,
          isRecord: isNewRecord,
          comparison: {
            label: t("trainComplete.modes.speedrun.previousBest"),
            value: formatTime(deckRecords.bestSpeedRunTime),
            diff,
          },
          stats: [
            {
              label: t("trainComplete.modes.speedrun.penalties"),
              value: `+${speedRunPenalty}s`,
              icon: "warning" as const,
            },
            {
              label: t("trainComplete.modes.speedrun.attempts"),
              value: deckRecords.speedRunAttempts.toString(),
              icon: "repeat" as const,
            },
          ],
        };
      }

      case "streak": {
        if (isFirstRun) {
          return {
            title: t("trainComplete.modes.streak.firstRun"),
            mainValue: bestStreak.toString(),
            mainLabel: t("trainComplete.modes.streak.bestStreak"),
            subtitle: t("trainComplete.modes.streak.livesRemaining", {
              count: currentLives,
            }),
            color: "#ef4444",
            icon: "flame" as const,
            isRecord: true,
            stats: [
              {
                label: t("trainComplete.modes.streak.livesLeft"),
                value: currentLives.toString(),
                icon: "heart" as const,
              },
              {
                label: t("trainComplete.modes.streak.cards"),
                value: totalCards.toString(),
                icon: "albums" as const,
              },
            ],
          };
        }

        const isNewRecord = bestStreak > deckRecords.bestStreak;
        const diff = bestStreak - deckRecords.bestStreak;

        return {
          title: isNewRecord
            ? t("trainComplete.modes.streak.newRecord")
            : t("trainComplete.modes.streak.complete"),
          mainValue: bestStreak.toString(),
          mainLabel: t("trainComplete.modes.streak.yourStreak"),
          subtitle: isNewRecord
            ? t("trainComplete.modes.streak.beatRecord", { count: diff })
            : t("trainComplete.modes.streak.awayFromRecord", {
                count: Math.abs(diff),
              }),
          color: isNewRecord ? "#10b981" : "#ef4444",
          icon: "flame" as const,
          isRecord: isNewRecord,
          comparison: isNewRecord
            ? {
                label: t("trainComplete.modes.speedrun.previousBest"),
                value: deckRecords.bestStreak.toString(),
                diff,
              }
            : undefined,
          stats: [
            {
              label: t("trainComplete.modes.streak.livesLeft"),
              value: currentLives.toString(),
              icon: "heart" as const,
            },
            {
              label: t("trainComplete.modes.streak.record"),
              value: deckRecords.bestStreak.toString(),
              icon: "trophy" as const,
            },
          ],
        };
      }

      case "timeattack": {
        const avgTime = totalCards > 0 ? (10 * totalCards) / totalCards : 0;

        if (isFirstRun) {
          return {
            title: t("trainComplete.modes.timeattack.firstRun"),
            mainValue: `${avgTime.toFixed(1)}s`,
            mainLabel: t("trainComplete.modes.timeattack.avgPerCard"),
            subtitle: t("trainComplete.modes.timeattack.firstAttempt"),
            color: "#8b5cf6",
            icon: "timer" as const,
            isRecord: true,
            stats: [
              {
                label: t("trainComplete.modes.timeattack.cards"),
                value: totalCards.toString(),
                icon: "albums" as const,
              },
              {
                label: t("trainComplete.modes.timeattack.totalTime"),
                value: `${totalCards * 10}s`,
                icon: "time" as const,
              },
            ],
          };
        }

        const isNewRecord = avgTime < deckRecords.bestAvgTimePerCard;

        return {
          title: isNewRecord
            ? t("trainComplete.modes.timeattack.newRecord")
            : t("trainComplete.modes.timeattack.complete"),
          mainValue: `${avgTime.toFixed(1)}s`,
          mainLabel: t("trainComplete.modes.timeattack.avgPerCard"),
          subtitle: isNewRecord
            ? t("trainComplete.modes.timeattack.improved")
            : t("trainComplete.modes.timeattack.keepPracticing"),
          color: isNewRecord ? "#10b981" : "#8b5cf6",
          icon: "timer" as const,
          isRecord: isNewRecord,
          comparison: {
            label: t("trainComplete.modes.speedrun.previousBest"),
            value: `${deckRecords.bestAvgTimePerCard.toFixed(1)}s`,
            diff: avgTime - deckRecords.bestAvgTimePerCard,
          },
          stats: [
            {
              label: t("trainComplete.modes.timeattack.cards"),
              value: totalCards.toString(),
              icon: "albums" as const,
            },
            {
              label: t("trainComplete.modes.timeattack.attempts"),
              value: deckRecords.timeAttackAttempts.toString(),
              icon: "repeat" as const,
            },
          ],
        };
      }

      case "perfect": {
        if (wasPerfect) {
          return {
            title: t("trainComplete.modes.perfect.success"),
            mainValue: t("trainComplete.modes.perfect.flawless"),
            mainLabel: t("trainComplete.modes.perfect.victory"),
            subtitle: t("trainComplete.modes.perfect.runsCompleted", {
              count: deckRecords.perfectRunsCompleted + 1,
            }),
            color: "#ec4899",
            icon: "diamond" as const,
            isRecord: true,
            stats: [
              {
                label: t("trainComplete.modes.perfect.successRate"),
                value: `${Math.round(
                  ((deckRecords.perfectRunsCompleted + 1) /
                    (deckRecords.perfectRunAttempts + 1)) *
                    100,
                )}%`,
                icon: "stats-chart" as const,
              },
              {
                label: t("trainComplete.modes.perfect.totalAttempts"),
                value: (deckRecords.perfectRunAttempts + 1).toString(),
                icon: "repeat" as const,
              },
            ],
          };
        } else {
          return {
            title: t("trainComplete.modes.perfect.failed"),
            mainValue: deckRecords.perfectRunsCompleted.toString(),
            mainLabel: t("trainComplete.modes.perfect.perfectRuns"),
            subtitle: t("trainComplete.modes.perfect.tryAgain"),
            color: "#64748b",
            icon: "close-circle" as const,
            isRecord: false,
            stats: [
              {
                label: t("trainComplete.modes.perfect.successRate"),
                value: `${
                  deckRecords.perfectRunAttempts > 0
                    ? Math.round(
                        (deckRecords.perfectRunsCompleted /
                          deckRecords.perfectRunAttempts) *
                          100,
                      )
                    : 0
                }%`,
                icon: "stats-chart" as const,
              },
              {
                label: t("trainComplete.modes.speedrun.attempts"),
                value: deckRecords.perfectRunAttempts.toString(),
                icon: "repeat" as const,
              },
            ],
          };
        }
      }

      default:
        return null;
    }
  }, [
    gameMode,
    deckRecords,
    bestStreak,
    speedRunTime,
    speedRunPenalty,
    totalCards,
    currentLives,
    wasPerfect,
    t,
  ]);
}
