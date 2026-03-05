import { useMemo, useState, useRef, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { getDeckRecords } from "@/services/deck_records.api";
import { useAuth } from "@/services/auth_context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useModeStats from "@/hooks/useModeStats";
import ModeStatsCard from "@/app/components/train/complete/ModeStatsCard";
import CompleteActions from "@/app/components/train/complete/CompleteActions";
import Scanlines from "@/app/components/Scanlines";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import { getLevelColors } from "@/utils/getLevelColors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MODE_COLORS: Record<string, string> = {
  classic: "#5b8af5",
  speedrun: "#e8453c",
  streak: "#06b6d4",
  timeattack: "#a855f7",
  perfect: "#f5c542",
};

function AnimatedPerformanceCard({
  successRate,
  totalCorrect,
  totalIncorrect,
  bestStreak,
  t,
}: {
  successRate: number;
  totalCorrect: number;
  totalIncorrect: number;
  bestStreak: number;
  t: any;
}) {
  const animProgress = useRef(new Animated.Value(0)).current;
  const [displayPercent, setDisplayPercent] = useState(0);

  const getColor = () => {
    if (successRate >= 75) return { text: "#44d9a0", bg: "#1a3d2e" };
    if (successRate >= 50) return { text: "#f5c542", bg: "#3d2e1a" };
    return { text: "#e8453c", bg: "#3d1a1a" };
  };

  const perfColor = getColor();

  const size = 90;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animProgress, {
      toValue: successRate,
      duration: 1200,
      delay: 400,
      useNativeDriver: false,
    }).start();

    const listenerId = animProgress.addListener(({ value }) => {
      setDisplayPercent(Math.round(value));
    });

    return () => animProgress.removeListener(listenerId);
  }, [successRate]);

  const strokeDashoffset = animProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View
      className="mx-6 mb-4 p-5 bg-card rounded-2xl border-2 border-border"
      style={pillShadow.sm}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ alignItems: "center", marginRight: 20 }}>
          <View
            style={{
              width: size,
              height: size,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg
              width={size}
              height={size}
              style={{
                position: "absolute",
                transform: [{ rotate: "-90deg" }],
              }}
            >
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={perfColor.bg}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={perfColor.text}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </Svg>
            <Text
              style={{
                color: perfColor.text,
                fontSize: 26,
                fontWeight: "900",
              }}
            >
              {displayPercent}%
            </Text>
          </View>
          <Text
            style={{
              color: "#6e9e8a",
              fontSize: 9,
              fontWeight: "700",
              letterSpacing: 2,
              marginTop: 6,
            }}
          >
            {t(
              "trainComplete.performance.successRate",
              "RÉUSSITE",
            ).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1, gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#0c3429",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: "#1a3d2e",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="#44d9a0" />
            </View>
            <Text
              style={{
                color: "#44d9a0",
                fontSize: 18,
                fontWeight: "900",
                flex: 1,
              }}
            >
              {totalCorrect}
            </Text>
            <Text
              style={{
                color: "#6e9e8a",
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 1,
              }}
            >
              {t("trainComplete.stats.correct", "CORRECT").toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#0c3429",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: "#3d1a1a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close-circle" size={18} color="#e8453c" />
            </View>
            <Text
              style={{
                color: "#e8453c",
                fontSize: 18,
                fontWeight: "900",
                flex: 1,
              }}
            >
              {totalIncorrect}
            </Text>
            <Text
              style={{
                color: "#6e9e8a",
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 1,
              }}
            >
              {t("trainComplete.stats.incorrect", "INCORRECT").toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#0c3429",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: "#3d2e1a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="flash" size={18} color="#f5c542" />
            </View>
            <Text
              style={{
                color: "#f5c542",
                fontSize: 18,
                fontWeight: "900",
                flex: 1,
              }}
            >
              {bestStreak}
            </Text>
            <Text
              style={{
                color: "#6e9e8a",
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 1,
              }}
            >
              {t("trainComplete.stats.bestStreak", "SÉRIE").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

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
  const [phase, setPhase] = useState<1 | 2>(1);

  const phase1Opacity = useRef(new Animated.Value(1)).current;
  const phase2Opacity = useRef(new Animated.Value(0)).current;
  const phase2TranslateY = useRef(new Animated.Value(40)).current;

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
      if (maxStreak >= 70)
        return {
          level: "max",
          name: "Ruby",
          icon: "diamond",
          color: "#dc2626",
          required: 70,
        };
      if (maxStreak >= 50)
        return {
          level: "ruby",
          name: "Ruby",
          icon: "diamond",
          color: "#dc2626",
          required: 70,
        };
      if (maxStreak >= 30)
        return {
          level: "platinum",
          name: "Platinum",
          icon: "medal",
          color: "#94a3b8",
          required: 50,
        };
      if (maxStreak >= 10)
        return {
          level: "gold",
          name: "Gold",
          icon: "trophy",
          color: "#f59e0b",
          required: 30,
        };
      return {
        level: "silver",
        name: "Silver",
        icon: "ribbon",
        color: "#d1d5db",
        required: 10,
      };
    };

    const cardsWithUpgradeInfo = deck.cards
      .map((card) => {
        const maxStreak = card.progress?.maxStreak || 0;
        const nextLevel = getNextLevel(maxStreak);
        if (nextLevel.level === "max") return null;
        const remaining = nextLevel.required - maxStreak;
        const percentToNext =
          ((nextLevel.required - remaining) / nextLevel.required) * 100;
        return {
          id: card.id,
          word: card.word,
          translation: card.translation,
          remaining,
          nextLevel,
          percentToNext,
        };
      })
      .filter((card) => card !== null && card.remaining > 0);

    return cardsWithUpgradeInfo
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 3);
  }, [deck]);

  const headerConfig = useMemo(() => {
    const modeColor = MODE_COLORS[currentGameMode] || MODE_COLORS.classic;
    if (currentGameMode === "perfect" && wasPerfect)
      return {
        icon: "diamond",
        color: "#f5c542",
        title: t("trainComplete.headers.perfect"),
      };
    if (modeStats?.isRecord && !isRealError)
      return {
        icon: "trophy",
        color: "#44d9a0",
        title: t("trainComplete.headers.newRecord"),
      };
    return {
      icon: "checkmark-circle",
      color: modeColor,
      title: t("trainComplete.headers.complete"),
    };
  }, [currentGameMode, wasPerfect, modeStats?.isRecord, isRealError, t]);

  const goToPhase2 = () => {
    Animated.timing(phase1Opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setPhase(2);
      Animated.parallel([
        Animated.timing(phase2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(phase2TranslateY, {
          toValue: 0,
          stiffness: 200,
          damping: 20,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View className="flex-1 bg-background">
      <Scanlines />

      {phase === 1 ? (
        <Animated.View style={{ flex: 1, opacity: phase1Opacity }}>
          <SafeAreaView edges={["top"]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 20,
                gap: 14,
              }}
            >
              <View
                style={[
                  {
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: headerConfig.color,
                  },
                  pillShadow.sm,
                ]}
              >
                <Ionicons
                  name={headerConfig.icon as any}
                  size={28}
                  color="#fff"
                />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    color: "#e8edf5",
                    fontSize: 17,
                    fontWeight: "900",
                    letterSpacing: 2,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {headerConfig.title.toUpperCase()}
                </Text>
                {deck?.name && (
                  <Text
                    style={{
                      color: "#6e9e8a",
                      fontSize: 13,
                      fontWeight: "600",
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    {deck.name}
                  </Text>
                )}
              </View>

              {modeStats?.isRecord && !isRealError && (
                <View
                  style={[
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                      backgroundColor: "#f5c542",
                    },
                    pillShadow.sm,
                  ]}
                >
                  <Text
                    style={{
                      color: "#0b3d2e",
                      fontSize: 10,
                      fontWeight: "900",
                      letterSpacing: 1.5,
                    }}
                  >
                    RECORD
                  </Text>
                </View>
              )}
            </View>
          </SafeAreaView>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {modeStats && !isRealError && (
              <ModeStatsCard modeStats={modeStats} />
            )}

            {(currentGameMode !== "perfect" || !wasPerfect) && (
              <AnimatedPerformanceCard
                successRate={successRate}
                totalCorrect={totalCorrect}
                totalIncorrect={totalIncorrect}
                bestStreak={bestStreak}
                t={t}
              />
            )}
          </ScrollView>

          <View className="p-6 bg-secondary border-t-2 border-border">
            <TouchableOpacity
              onPress={goToPhase2}
              activeOpacity={0.8}
              className="flex-row items-center justify-center gap-3 py-5 rounded-2xl"
              style={[{ backgroundColor: "#44d9a0" }, pillShadow.default]}
            >
              <Text className="text-[#0b3d2e] text-base font-bold tracking-wider">
                {t("trainComplete.continue", "CONTINUER").toUpperCase()}
              </Text>
              <Ionicons name="arrow-forward" size={22} color="#0b3d2e" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            flex: 1,
            opacity: phase2Opacity,
            transform: [{ translateY: phase2TranslateY }],
          }}
        >
          <Phase2Screen
            almostUpgradeCards={almostUpgradeCards}
            deckId={id}
            deckName={deck?.name}
          />
        </Animated.View>
      )}
    </View>
  );
}

type Phase2Props = {
  almostUpgradeCards: any[];
  deckId: string | string[];
  deckName?: string;
};

function Phase2Screen({ almostUpgradeCards, deckId, deckName }: Phase2Props) {
  const { t } = useTranslation();

  const cardAnims = useRef(
    almostUpgradeCards.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(-30),
      barWidth: new Animated.Value(0),
      plusOneOpacity: new Animated.Value(0),
      plusOneScale: new Animated.Value(0.3),
      plusOneTranslateY: new Animated.Value(0),
    })),
  ).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(titleTranslateY, {
        toValue: 0,
        stiffness: 200,
        damping: 20,
        useNativeDriver: true,
      }),
    ]).start();

    cardAnims.forEach((anim, index) => {
      setTimeout(
        () => {
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(anim.translateX, {
              toValue: 0,
              stiffness: 250,
              damping: 22,
              useNativeDriver: true,
            }),
          ]).start();

          setTimeout(() => {
            Animated.timing(anim.barWidth, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }).start(() => {
              Animated.parallel([
                Animated.spring(anim.plusOneScale, {
                  toValue: 1,
                  stiffness: 400,
                  damping: 12,
                  useNativeDriver: true,
                }),
                Animated.timing(anim.plusOneOpacity, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                setTimeout(() => {
                  Animated.parallel([
                    Animated.timing(anim.plusOneTranslateY, {
                      toValue: -20,
                      duration: 600,
                      useNativeDriver: true,
                    }),
                    Animated.timing(anim.plusOneOpacity, {
                      toValue: 0,
                      duration: 600,
                      useNativeDriver: true,
                    }),
                  ]).start();
                }, 800);
              });
            });
          }, 200);
        },
        300 + index * 400,
      );
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 24,
              gap: 14,
            }}
          >
            <View
              style={[
                {
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#5b8af5",
                },
                pillShadow.sm,
              ]}
            >
              <Ionicons name="trending-up" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#e8edf5",
                  fontSize: 17,
                  fontWeight: "900",
                  letterSpacing: 2,
                }}
              >
                {t("trainComplete.phase2.title", "PROGRESSION").toUpperCase()}
              </Text>
              {deckName && (
                <Text
                  style={{
                    color: "#6e9e8a",
                    fontSize: 13,
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {deckName}
                </Text>
              )}
            </View>
          </Animated.View>

          {almostUpgradeCards.length > 0 ? (
            <View style={{ paddingHorizontal: 24, gap: 16 }}>
              {almostUpgradeCards.map((card, index) => {
                const levelColors = getLevelColors(card.nextLevel.color);
                const anim = cardAnims[index];

                return (
                  <Animated.View
                    key={card.id}
                    style={[
                      {
                        opacity: anim.opacity,
                        transform: [{ translateX: anim.translateX }],
                        backgroundColor: "#134c39",
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: "#2a7a60",
                        padding: 20,
                      },
                      pillShadow.sm,
                    ]}
                  >
                    <Animated.View
                      style={{
                        position: "absolute",
                        right: 20,
                        top: -14,
                        opacity: anim.plusOneOpacity,
                        transform: [
                          { scale: anim.plusOneScale },
                          { translateY: anim.plusOneTranslateY },
                        ],
                        zIndex: 10,
                      }}
                    >
                      <View
                        style={[
                          {
                            backgroundColor: "#44d9a0",
                            paddingHorizontal: 12,
                            paddingVertical: 5,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: "#6ee8b7",
                          },
                          pillShadow.sm,
                        ]}
                      >
                        <Text
                          style={{
                            color: "#0b3d2e",
                            fontSize: 15,
                            fontWeight: "900",
                            letterSpacing: 1,
                          }}
                        >
                          +1
                        </Text>
                      </View>
                    </Animated.View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <Text
                          style={{
                            color: "#e8edf5",
                            fontSize: 16,
                            fontWeight: "700",
                          }}
                          numberOfLines={1}
                        >
                          {card.word}
                        </Text>
                        <Text
                          style={{
                            color: "#6e9e8a",
                            fontSize: 13,
                            marginTop: 2,
                          }}
                          numberOfLines={1}
                        >
                          {card.translation}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 10,
                          backgroundColor: levelColors.bg,
                        }}
                      >
                        <Ionicons
                          name={card.nextLevel.icon as any}
                          size={14}
                          color={levelColors.text}
                        />
                        <Text
                          style={{
                            color: levelColors.text,
                            fontSize: 12,
                            fontWeight: "700",
                          }}
                        >
                          {card.remaining}{" "}
                          {t("trainComplete.phase2.left", "restants")}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          height: 10,
                          backgroundColor: "#0a1f18",
                          borderRadius: 999,
                          overflow: "hidden",
                          borderWidth: 1,
                          borderColor: "#2a7a60",
                        }}
                      >
                        <Animated.View
                          style={{
                            height: "100%",
                            borderRadius: 999,
                            backgroundColor: levelColors.text,
                            width: anim.barWidth.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", `${card.percentToNext}%`],
                            }),
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: levelColors.text,
                          fontSize: 11,
                          fontWeight: "700",
                          minWidth: 50,
                        }}
                      >
                        → {card.nextLevel.name}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          ) : (
            <View
              style={{
                marginHorizontal: 24,
                padding: 24,
                backgroundColor: "#134c39",
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#2a7a60",
                alignItems: "center",
              }}
            >
              <Ionicons name="sparkles" size={32} color="#f5c542" />
              <Text
                style={{
                  color: "#e8edf5",
                  fontSize: 15,
                  fontWeight: "700",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                {t(
                  "trainComplete.phase2.allMaxed",
                  "Toutes vos cartes sont au niveau maximum !",
                )}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <CompleteActions deckId={deckId} />
    </View>
  );
}
