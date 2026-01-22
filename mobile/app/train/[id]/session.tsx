import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { answerCard } from "@/services/progress.api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { Card } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Extrapolation,
  cancelAnimation,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const shuffle = (array: Card[]) => {
  const copy = [...array];
  let currentIndex = copy.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[currentIndex],
    ];
  }

  return copy;
};

const getStatusColors = (status?: string): [string, string, string] => {
  switch (status) {
    case "ruby":
      return ["#7f1d1d", "#dc2626", "#991b1b"];
    case "platinum":
      return ["#334155", "#94a3b8", "#475569"];
    case "gold":
      return ["#92400e", "#fbbf24", "#b45309"];
    case "silver":
      return ["#64748b", "#e2e8f0", "#94a3b8"];
    default:
      return ["#78350f", "#d97706", "#92400e"];
  }
};

const getTextColor = (status?: string): string => {
  switch (status) {
    case "silver":
    case "platinum":
      return "#1e293b";
    default:
      return "#ffffff";
  }
};

const getSubtextColor = (status?: string): string => {
  switch (status) {
    case "silver":
    case "platinum":
      return "#64748b";
    default:
      return "rgba(255, 255, 255, 0.7)";
  }
};

interface SwipeableCardProps {
  cardKey: string;
  status?: string;
  isFlipped: boolean;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  onFlip: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  flipAnim: Animated.Value;
}

function SwipeableCard({
  cardKey,
  status,
  isFlipped,
  frontContent,
  backContent,
  onFlip,
  onSwipeLeft,
  onSwipeRight,
  flipAnim,
}: SwipeableCardProps) {
  const colors = getStatusColors(status);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hintAnimation = useSharedValue(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    hintAnimation.value = 0;
    setHasAnimated(false);
  }, [cardKey]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isFlipped && !hasAnimated) {
      timeout = setTimeout(() => {
        hintAnimation.value = withRepeat(
          withSequence(
            withTiming(30, { duration: 400 }),
            withTiming(0, { duration: 400 }),
            withDelay(200, withTiming(-30, { duration: 400 })),
            withTiming(0, { duration: 400 }),
            withDelay(1000, withTiming(0, { duration: 0 })),
          ),
          -1,
          false,
        );
      }, 5000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      cancelAnimation(hintAnimation);
      hintAnimation.value = 0;
    };
  }, [isFlipped, cardKey, hasAnimated, hintAnimation]);

  const handleSwipeEnd = useCallback(
    (translationX: number) => {
      if (hasAnimated) return;

      cancelAnimation(hintAnimation);
      hintAnimation.value = 0;

      if (translationX > SWIPE_THRESHOLD) {
        setHasAnimated(true);
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 });
        setTimeout(() => {
          onSwipeRight();
        }, 300);
      } else if (translationX < -SWIPE_THRESHOLD) {
        setHasAnimated(true);
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 });
        setTimeout(() => {
          onSwipeLeft();
        }, 300);
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    },
    [
      hasAnimated,
      onSwipeLeft,
      onSwipeRight,
      translateX,
      translateY,
      hintAnimation,
    ],
  );

  const pan = Gesture.Pan()
    .enabled(isFlipped && !hasAnimated)
    .onStart(() => {
      cancelAnimation(hintAnimation);
      hintAnimation.value = 0;
    })
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3;
    })
    .onEnd((event) => {
      handleSwipeEnd(event.translationX);
    })
    .runOnJS(true);

  const tap = Gesture.Tap()
    .enabled(!hasAnimated)
    .onEnd(() => {
      onFlip();
    })
    .runOnJS(true);

  const gesture = Gesture.Race(pan, tap);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value + hintAnimation.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value + hintAnimation.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const rightIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.5, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ scale }, { rotate: "-15deg" }],
    };
  });

  const leftIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0.5],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ scale }, { rotate: "15deg" }],
    };
  });

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <GestureDetector gesture={gesture}>
      <ReanimatedAnimated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: frontInterpolate }] },
            !isFlipped && styles.cardVisible,
          ]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardInner}>{frontContent}</View>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] },
            isFlipped && styles.cardVisible,
          ]}
        >
          {backContent}

          <ReanimatedAnimated.View
            style={[
              styles.tinderIndicator,
              styles.tinderIndicatorRight,
              rightIndicatorStyle,
            ]}
          >
            <Text style={styles.tinderTextCorrect}>CORRECT</Text>
          </ReanimatedAnimated.View>

          <ReanimatedAnimated.View
            style={[
              styles.tinderIndicator,
              styles.tinderIndicatorLeft,
              leftIndicatorStyle,
            ]}
          >
            <Text style={styles.tinderTextNope}>NOPE</Text>
          </ReanimatedAnimated.View>
        </Animated.View>
      </ReanimatedAnimated.View>
    </GestureDetector>
  );
}

export default function TrainingSessionScreen() {
  const { id, isShuffle, isReverse } = useLocalSearchParams();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnim, setFlipAnim] = useState(() => new Animated.Value(0));

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  useEffect(() => {
    if (!deck) return;

    const sessionCards =
      isShuffle === "true" ? shuffle(deck.cards) : deck.cards;

    setCards(sessionCards);
    setCurrentIndex(0);
  }, [deck, isShuffle]);

  const answerMutation = useMutation({
    mutationFn: ({ cardId, success }: { cardId: number; success: boolean }) =>
      answerCard(user!.id, cardId, success),
  });

  const goToNextCard = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= cards.length) {
        setTimeout(() => {
          router.replace({
            pathname: "/train/[id]/complete",
            params: { id },
          });
        }, 0);
        return prev;
      }
      return nextIndex;
    });
    setIsFlipped(false);
    setFlipAnim(new Animated.Value(0));
  }, [cards, id]);

  const handleSwipeRight = useCallback(async () => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await answerMutation.mutateAsync({
        cardId: currentCard.id,
        success: true,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    goToNextCard();
  }, [cards, currentIndex, answerMutation, goToNextCard]);

  const handleSwipeLeft = useCallback(async () => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await answerMutation.mutateAsync({
        cardId: currentCard.id,
        success: false,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    goToNextCard();
  }, [cards, currentIndex, answerMutation, goToNextCard]);

  const flipCard = useCallback(() => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped((prev) => !prev);
  }, [flipAnim, isFlipped]);

  if (isLoading || cards.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!deck || deck.cards.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="albums-outline" size={64} color="#cbd5e1" />
        <Text style={styles.emptyTitle}>No cards in this deck</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/deck/${id}/add-card`)}
        >
          <Text style={styles.buttonText}>Add Cards</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const cardProgress = Array.isArray(currentCard.progress)
    ? currentCard.progress.find((p) => p.userId === user?.id)
    : currentCard.progress;
  const cardStatus = cardProgress?.status || "bronze";

  const textColor = getTextColor(cardStatus);
  const subtextColor = getSubtextColor(cardStatus);

  const frontText =
    isReverse === "true" ? currentCard.translation : currentCard.word;
  const backText =
    isReverse === "true" ? currentCard.word : currentCard.translation;
  const frontLabel = isReverse === "true" ? "Translation" : "Word";
  const backLabel = isReverse === "true" ? "Word" : "Translation";

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{deck.name}</Text>
          {isReverse === "true" && (
            <View style={styles.reverseBadge}>
              <Ionicons name="swap-horizontal" size={12} color="#10b981" />
              <Text style={styles.reverseBadgeText}>Reverse</Text>
            </View>
          )}
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {cards.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.cardArea}>
        <View style={styles.cardContainer}>
          <SwipeableCard
            key={`${currentCard.id}-${currentIndex}`}
            cardKey={`${currentCard.id}-${currentIndex}`}
            status={cardStatus}
            isFlipped={isFlipped}
            onFlip={flipCard}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            flipAnim={flipAnim}
            frontContent={
              <>
                <Text style={[styles.cardLabel, { color: subtextColor }]}>
                  {frontLabel}
                </Text>
                <Text style={[styles.cardText, { color: textColor }]}>
                  {frontText}
                </Text>
                <View style={styles.tapHint}>
                  <Ionicons name="hand-left" size={20} color={subtextColor} />
                  <Text style={[styles.tapHintText, { color: subtextColor }]}>
                    Tap to flip
                  </Text>
                </View>
              </>
            }
            backContent={
              <>
                <Text style={[styles.cardLabel, styles.cardLabelBack]}>
                  {backLabel}
                </Text>
                <Text style={[styles.cardText, styles.cardTextBack]}>
                  {backText}
                </Text>
                <View style={styles.swipeHint}>
                  <View style={styles.swipeHintItem}>
                    <Ionicons name="arrow-back" size={16} color="#ef4444" />
                    <Text style={styles.swipeHintText}>Wrong</Text>
                  </View>
                  <View style={styles.swipeHintItem}>
                    <Text style={styles.swipeHintText}>Correct</Text>
                    <Ionicons name="arrow-forward" size={16} color="#22c55e" />
                  </View>
                </View>
              </>
            }
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  reverseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  reverseBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10b981",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textAlign: "center",
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
  cardArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
    position: "absolute",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardInner: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  cardBack: {
    backgroundColor: "#3b82f6",
    padding: 32,
    justifyContent: "center",
  },
  cardVisible: {
    zIndex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    alignSelf: "center",
    marginBottom: 24,
  },
  cardLabelBack: {
    color: "#bfdbfe",
    alignSelf: "center",
  },
  cardText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  cardTextBack: {
    color: "#fff",
  },
  tapHint: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
  },
  tapHintText: {
    fontSize: 14,
  },
  swipeHint: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  swipeHintItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  swipeHintText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  tinderIndicator: {
    position: "absolute",
    top: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  tinderIndicatorRight: {
    left: 20,
    borderColor: "#22c55e",
  },
  tinderIndicatorLeft: {
    right: 20,
    borderColor: "#ef4444",
  },
  tinderTextCorrect: {
    fontSize: 24,
    fontWeight: "900",
    color: "#22c55e",
    letterSpacing: 2,
  },
  tinderTextNope: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ef4444",
    letterSpacing: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
