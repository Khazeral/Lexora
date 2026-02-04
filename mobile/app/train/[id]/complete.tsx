import { useEffect, useState, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ScrollView, Animated, Easing } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { getDeckRecords } from "@/services/deck_records.api";
import { useAuth } from "@/services/auth_context";
import { useTranslation } from "react-i18next";
import useModeStats from "@/hooks/useModeStats";
import CompleteHeader from "@/app/components/train/complete/CompleteHeader";
import ModeStatsCard from "@/app/components/train/complete/ModeStatsCard";
import PerformanceCard from "@/app/components/train/complete/PerformanceCard";
import StatsGrid from "@/app/components/train/complete/StatsGrid";
import AlmostThereSection from "@/app/components/train/complete/AlmostThereSection";
import CompleteActions from "@/app/components/train/complete/CompleteActions";
import Confetti from "@/app/components/Confettis";

export default function TrainingCompleteScreen() {
  const {
    id,
    sessionCorrect,
    sessionIncorrect,
    sessionBestStreak,
    gameMode,
    finalTime,
    timePenalty,
    livesLeft,
    isPerfect,
    previousBestSpeedRun,
    previousBestStreak,
    previousBestAvgTime,
    previousPerfectRuns,
    avgTimePerCard,
  } = useLocalSearchParams();

  const { t } = useTranslation();
  const { user } = useAuth();

  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [confettiAnims] = useState(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    })),
  );

  const { data: deck } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
    refetchOnMount: "always",
    staleTime: 0,
  });

  const {
    data: deckRecords,
    isLoading: isLoadingRecords,
    isError,
    error,
  } = useQuery({
    queryKey: ["deckRecords", id, user?.id],
    queryFn: () => getDeckRecords(Number(id)),
    enabled: !!user && !!id,
    refetchOnMount: "always",
    staleTime: 0,
    retry: false,
  });

  const isRealError =
    isError &&
    !(
      (error as any)?.message?.includes("404") ||
      (error as any)?.message?.includes("No records found")
    );

  const totalCorrect = Number(sessionCorrect) || 0;
  const totalIncorrect = Number(sessionIncorrect) || 0;
  const bestStreak = Number(sessionBestStreak) || 0;
  const currentGameMode = (gameMode as string) || "classic";
  const speedRunTime = Number(finalTime) || 0;
  const speedRunPenalty = Number(timePenalty) || 0;
  const currentLives = Number(livesLeft) || 0;
  const wasPerfect = isPerfect === "true";
  const totalCards = deck?.cards.length || 0;
  const sessionAvgTime = Number(avgTimePerCard) || 0;

  const prevSpeedRun =
    previousBestSpeedRun === "null" || !previousBestSpeedRun
      ? null
      : Number(previousBestSpeedRun);

  const prevStreak =
    previousBestStreak === "null" || !previousBestStreak
      ? null
      : Number(previousBestStreak);

  const prevAvgTime =
    previousBestAvgTime === "null" || !previousBestAvgTime
      ? null
      : Number(previousBestAvgTime);

  const prevPerfect =
    previousPerfectRuns === "null" || !previousPerfectRuns
      ? null
      : Number(previousPerfectRuns);

  const successRate = useMemo(() => {
    if (totalCorrect + totalIncorrect === 0) return 0;
    return Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100);
  }, [totalCorrect, totalIncorrect]);

  const modeStats = useModeStats({
    gameMode: currentGameMode,
    deckRecords,
    sessionCorrect: totalCorrect,
    sessionIncorrect: totalIncorrect,
    bestStreak,
    speedRunTime,
    speedRunPenalty,
    totalCards,
    currentLives,
    wasPerfect,
    avgTimePerCard: sessionAvgTime,
    previousBestSpeedRun: prevSpeedRun,
    previousBestStreak: prevStreak,
    previousBestAvgTime: prevAvgTime,
    previousPerfectRuns: prevPerfect,
    isLoadingRecords,
    recordsError: isRealError,
  });

  const almostUpgradeCards = useMemo(() => {
    if (!deck) return [];

    const getNextLevel = (maxStreak: number) => {
      if (maxStreak >= 100)
        return {
          level: "max",
          name: "Ruby",
          icon: "diamond",
          color: "#dc2626",
          required: 100,
        };
      if (maxStreak >= 70)
        return {
          level: "ruby",
          name: "Ruby",
          icon: "diamond",
          color: "#dc2626",
          required: 100,
        };
      if (maxStreak >= 50)
        return {
          level: "platinum",
          name: "Platinum",
          icon: "medal",
          color: "#94a3b8",
          required: 70,
        };
      if (maxStreak >= 30)
        return {
          level: "gold",
          name: "Gold",
          icon: "trophy",
          color: "#f59e0b",
          required: 50,
        };
      if (maxStreak >= 10)
        return {
          level: "silver",
          name: "Silver",
          icon: "ribbon",
          color: "#d1d5db",
          required: 30,
        };
      return {
        level: "bronze",
        name: "Bronze",
        icon: "help-circle",
        color: "#cd7f32",
        required: 10,
      };
    };

    const cardsWithProgress = deck.cards.filter((card) => card.progress) || [];

    const cardsWithUpgradeInfo = cardsWithProgress
      .map((card) => {
        const maxStreak = card.progress?.maxStreak || 0;
        const nextLevel = getNextLevel(maxStreak);

        if (nextLevel.level === "max") return null;

        const remaining = nextLevel.required - maxStreak;
        const percentToNext =
          ((nextLevel.required - remaining) / nextLevel.required) * 100;

        return {
          ...card,
          remaining,
          nextLevel,
          percentToNext,
        };
      })
      .filter((card) => card !== null && card.remaining > 0);

    if (totalCards >= 3) {
      return cardsWithUpgradeInfo
        .sort((a, b) => a.remaining - b.remaining)
        .slice(0, 3);
    }

    return cardsWithUpgradeInfo
      .filter((card) => card.remaining <= 3)
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 3);
  }, [deck, totalCards]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  useEffect(() => {
    if (modeStats) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [modeStats, fadeAnim]);

  useEffect(() => {
    if (!modeStats?.isRecord || isRealError) return;

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    const confettiAnimations = confettiAnims.map((anim, index) => {
      const randomX = (Math.random() - 0.5) * 400;
      const randomRotate = Math.random() * 720;
      const delay = index * 50;

      return Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: 800,
          duration: 3000,
          delay,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateX, {
          toValue: randomX,
          duration: 3000,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: randomRotate,
          duration: 3000,
          delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 3000,
          delay,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(confettiAnimations).start();

    return () => {
      pulseAnimation.stop();
    };
  }, [modeStats?.isRecord, isRealError, pulseAnim, confettiAnims]);

  const headerConfig = useMemo(() => {
    if (currentGameMode === "perfect" && wasPerfect) {
      return {
        icon: "diamond",
        colors: ["#ec4899", "#db2777"],
        title: t("trainComplete.headers.perfect"),
      };
    }
    if (modeStats?.isRecord && !isRealError) {
      return {
        icon: "trophy",
        colors: ["#10b981", "#059669"],
        title: t("trainComplete.headers.newRecord"),
      };
    }
    return {
      icon: "trophy",
      colors: ["#3b82f6", "#2563eb"],
      title: t("trainComplete.headers.complete"),
    };
  }, [currentGameMode, wasPerfect, modeStats?.isRecord, isRealError, t]);

  return (
    <View style={styles.container}>
      {modeStats?.isRecord && !isRealError && (
        <Confetti animations={confettiAnims} />
      )}

      <CompleteHeader
        icon={headerConfig.icon}
        colors={headerConfig.colors}
        title={headerConfig.title}
        deckName={deck?.name}
        scaleAnim={scaleAnim}
        pulseAnim={pulseAnim}
        isRecord={modeStats?.isRecord && !isRealError}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {modeStats && !isRealError && (
          <ModeStatsCard
            modeStats={modeStats}
            fadeAnim={fadeAnim}
            pulseAnim={pulseAnim}
          />
        )}

        {(currentGameMode !== "perfect" || !wasPerfect) && (
          <PerformanceCard successRate={successRate} fadeAnim={fadeAnim} />
        )}

        <StatsGrid
          correct={totalCorrect}
          incorrect={totalIncorrect}
          totalCards={totalCards}
          bestStreak={bestStreak}
        />

        <AlmostThereSection cards={almostUpgradeCards} />
      </ScrollView>

      <CompleteActions deckId={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
});
