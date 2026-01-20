import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { answerCard } from "@/services/progress.api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/types";

const shuffle = (array) => {
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

export default function TrainingSessionScreen() {
  const { id, isShuffle, isReverse } = useLocalSearchParams();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));
  const queryClient = useQueryClient();

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  useEffect(() => {
    if (!deck) return;

    const sessionCards =
      isShuffle === "true"
        ? shuffle(deck.cards)
        : deck.cards;

    setCards(sessionCards);
    setCurrentIndex(0);
  }, [deck, isShuffle]);

  const answerMutation = useMutation({
    mutationFn: ({ cardId, success }: { cardId: number; success: boolean }) =>
      answerCard(user!.id, cardId, success),

  });

  if (isLoading || (cards.length === 0 || currentIndex >= cards.length)) {
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


  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  console.log(cards)
  console.log(currentIndex)
  console.log(currentCard)

  const frontText =
    isReverse === "true" ? currentCard.translation : currentCard.word;
  const backText =
    isReverse === "true" ? currentCard.word : currentCard.translation;
  const frontLabel = isReverse === "true" ? "Translation" : "Word";
  const backLabel = isReverse === "true" ? "Word" : "Translation";

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = async (success: boolean) => {
    await answerMutation.mutateAsync({
      cardId: currentCard.id,
      success,
    });

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    } else {
      router.replace({
        pathname: "/train/[id]/complete",
        params: { id },
      });
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={styles.container}>
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

      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ rotateY: frontInterpolate }],
              },
              !isFlipped && styles.cardVisible,
            ]}
          >
            <Text style={styles.cardLabel}>{frontLabel}</Text>
            <Text style={styles.cardText}>{frontText}</Text>
            <View style={styles.tapHint}>
              <Ionicons name="hand-left" size={20} color="#94a3b8" />
              <Text style={styles.tapHintText}>Tap to flip</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
              },
              isFlipped && styles.cardVisible,
            ]}
          >
            <Text style={[styles.cardLabel, styles.cardLabelBack]}>
              {backLabel}
            </Text>
            <Text style={[styles.cardText, styles.cardTextBack]}>
              {backText}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>

      {isFlipped && (
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[styles.answerButton, styles.wrongButton]}
            onPress={() => handleAnswer(false)}
            disabled={answerMutation.isPending}
          >
            {answerMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="close-circle" size={32} color="#fff" />
                <Text style={styles.answerButtonText}>Wrong</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerButton, styles.correctButton]}
            onPress={() => handleAnswer(true)}
            disabled={answerMutation.isPending}
          >
            {answerMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={32} color="#fff" />
                <Text style={styles.answerButtonText}>Correct</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#3b82f6",
  },
  cardVisible: {
    zIndex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
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
    color: "#1e293b",
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
    color: "#94a3b8",
  },
  answerButtons: {
    flexDirection: "row",
    gap: 16,
    padding: 24,
  },
  answerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  wrongButton: {
    backgroundColor: "#ef4444",
  },
  correctButton: {
    backgroundColor: "#10b981",
  },
  answerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
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
