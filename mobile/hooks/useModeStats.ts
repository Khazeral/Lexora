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
  deckRecords: DeckRecords | undefined | null;
  sessionCorrect: number;
  sessionIncorrect: number;
  bestStreak: number;
  speedRunTime: number;
  avgTimePerCard?: number;
  speedRunPenalty: number;
  totalCards: number;
  currentLives: number;
  wasPerfect: boolean;
  previousBestSpeedRun: number | null;
  previousBestStreak: number | null;
  previousBestAvgTime: number | null;
  previousPerfectRuns: number | null;
  isLoadingRecords: boolean;
  recordsError: boolean;
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
  previousBestSpeedRun,
  previousBestStreak,
  previousBestAvgTime,
  previousPerfectRuns,
  isLoadingRecords,
  avgTimePerCard,
  recordsError,
}: ModeStatsParams) {
  const { t } = useTranslation();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return useMemo(() => {
    if (recordsError) {
      return null;
    }

    if (isLoadingRecords) {
      return null;
    }

    const records: DeckRecords = deckRecords || {
      bestSpeedRunTime: null,
      speedRunAttempts: 1,
      bestStreak: bestStreak,
      bestAvgTimePerCard: null,
      timeAttackAttempts: 1,
      perfectRunsCompleted: wasPerfect ? 1 : 0,
      perfectRunAttempts: 1,
    };

    switch (gameMode) {
      case "speedrun": {
        const isFirstRun = previousBestSpeedRun === null;

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

        const diff = speedRunTime - previousBestSpeedRun;
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
            value: formatTime(previousBestSpeedRun),
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
              value: records.speedRunAttempts.toString(),
              icon: "repeat" as const,
            },
          ],
        };
      }

      case "streak": {
        const isFirstRun = previousBestStreak === null;

        if (isFirstRun) {
          const subtitle =
            currentLives === 0
              ? t("trainComplete.modes.streak.livesRemaining_zero")
              : t("trainComplete.modes.streak.livesRemaining", {
                  count: currentLives,
                });

          return {
            title: t("trainComplete.modes.streak.firstRun"),
            mainValue: bestStreak.toString(),
            mainLabel: t("trainComplete.modes.streak.bestStreak"),
            subtitle,
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

        const isNewRecord = bestStreak > previousBestStreak;
        const diff = bestStreak - previousBestStreak;

        const subtitle = isNewRecord
          ? t("trainComplete.modes.streak.beatRecord", { count: diff })
          : currentLives === 0
            ? t("trainComplete.modes.streak.livesRemaining_zero")
            : t("trainComplete.modes.streak.awayFromRecord", {
                count: Math.abs(diff),
              });

        return {
          title: isNewRecord
            ? t("trainComplete.modes.streak.newRecord")
            : t("trainComplete.modes.streak.complete"),
          mainValue: bestStreak.toString(),
          mainLabel: t("trainComplete.modes.streak.yourStreak"),
          subtitle,
          color: isNewRecord ? "#10b981" : "#ef4444",
          icon: "flame" as const,
          isRecord: isNewRecord,
          comparison: isNewRecord
            ? {
                label: t("trainComplete.modes.speedrun.previousBest"),
                value: previousBestStreak.toString(),
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
              value: records.bestStreak.toString(),
              icon: "trophy" as const,
            },
          ],
        };
      }

      case "timeattack": {
        const avgTime = avgTimePerCard || 0;
        const isFirstRun = previousBestAvgTime === null;

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
                value: `${(avgTime * totalCards).toFixed(0)}s`,
                icon: "time" as const,
              },
            ],
          };
        }

        const isNewRecord = avgTime < previousBestAvgTime;

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
            value: `${previousBestAvgTime.toFixed(1)}s`,
            diff: avgTime - previousBestAvgTime,
          },
          stats: [
            {
              label: t("trainComplete.modes.timeattack.cards"),
              value: totalCards.toString(),
              icon: "albums" as const,
            },
            {
              label: t("trainComplete.modes.timeattack.attempts"),
              value: records.timeAttackAttempts.toString(),
              icon: "repeat" as const,
            },
          ],
        };
      }

      case "perfect": {
        if (wasPerfect) {
          const isFirstRun =
            previousPerfectRuns === null || previousPerfectRuns === 0;

          return {
            title: t("trainComplete.modes.perfect.success"),
            mainValue: t("trainComplete.modes.perfect.flawless"),
            mainLabel: t("trainComplete.modes.perfect.victory"),
            subtitle: t("trainComplete.modes.perfect.runsCompleted", {
              count: records.perfectRunsCompleted,
            }),
            color: "#ec4899",
            icon: "diamond" as const,
            isRecord: isFirstRun,
            stats: [
              {
                label: t("trainComplete.modes.perfect.successRate"),
                value: `${
                  records.perfectRunAttempts > 0
                    ? Math.round(
                        (records.perfectRunsCompleted /
                          records.perfectRunAttempts) *
                          100,
                      )
                    : 100
                }%`,
                icon: "stats-chart" as const,
              },
              {
                label: t("trainComplete.modes.perfect.totalAttempts"),
                value: records.perfectRunAttempts.toString(),
                icon: "repeat" as const,
              },
            ],
          };
        } else {
          return {
            title: t("trainComplete.modes.perfect.failed"),
            mainValue: records.perfectRunsCompleted.toString(),
            mainLabel: t("trainComplete.modes.perfect.perfectRuns"),
            subtitle: t("trainComplete.modes.perfect.tryAgain"),
            color: "#64748b",
            icon: "close-circle" as const,
            isRecord: false,
            stats: [
              {
                label: t("trainComplete.modes.perfect.successRate"),
                value: `${
                  records.perfectRunAttempts > 0
                    ? Math.round(
                        (records.perfectRunsCompleted /
                          records.perfectRunAttempts) *
                          100,
                      )
                    : 0
                }%`,
                icon: "stats-chart" as const,
              },
              {
                label: t("trainComplete.modes.speedrun.attempts"),
                value: records.perfectRunAttempts.toString(),
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
    recordsError,
    deckRecords,
    isLoadingRecords,
    gameMode,
    previousBestSpeedRun,
    speedRunTime,
    t,
    speedRunPenalty,
    previousBestStreak,
    bestStreak,
    currentLives,
    totalCards,
    avgTimePerCard,
    previousBestAvgTime,
    wasPerfect,
    previousPerfectRuns,
  ]);
}
