import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCard } from "@/services/cards.api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { LinearGradient } from "expo-linear-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;

type CardStatus = "bronze" | "silver" | "gold" | "platinum" | "ruby";

interface TextureConfig {
  baseColors: [string, string, string];
  frameColors: [string, string, string, string, string];
  accentColor: string;
  shineColor: string;
  glowColor: string;
  innerFrameColors: [string, string];
}

const getTextureConfig = (status: CardStatus): TextureConfig => {
  switch (status) {
    case "ruby":
      return {
        baseColors: ["#1a0a0a", "#2d0a0a", "#1a0a0a"],
        frameColors: ["#ff6b6b", "#dc2626", "#991b1b", "#dc2626", "#ff6b6b"],
        accentColor: "#fca5a5",
        shineColor: "rgba(255, 200, 200, 0.6)",
        glowColor: "#dc2626",
        innerFrameColors: ["#7f1d1d", "#450a0a"],
      };
    case "platinum":
      return {
        baseColors: ["#0f172a", "#1e293b", "#0f172a"],
        frameColors: ["#f1f5f9", "#94a3b8", "#64748b", "#94a3b8", "#f1f5f9"],
        accentColor: "#e2e8f0",
        shineColor: "rgba(255, 255, 255, 0.7)",
        glowColor: "#94a3b8",
        innerFrameColors: ["#475569", "#1e293b"],
      };
    case "gold":
      return {
        baseColors: ["#1a1207", "#2d1f0a", "#1a1207"],
        frameColors: ["#fef08a", "#fbbf24", "#f59e0b", "#fbbf24", "#fef08a"],
        accentColor: "#fde047",
        shineColor: "rgba(255, 230, 150, 0.6)",
        glowColor: "#fbbf24",
        innerFrameColors: ["#92400e", "#451a03"],
      };
    case "silver":
      return {
        baseColors: ["#18181b", "#27272a", "#18181b"],
        frameColors: ["#ffffff", "#d4d4d8", "#a1a1aa", "#d4d4d8", "#ffffff"],
        accentColor: "#e4e4e7",
        shineColor: "rgba(255, 255, 255, 0.5)",
        glowColor: "#a1a1aa",
        innerFrameColors: ["#52525b", "#27272a"],
      };
    default: // bronze
      return {
        baseColors: ["#1c1208", "#2a1a0a", "#1c1208"],
        frameColors: ["#d4a574", "#cd7f32", "#a0522d", "#cd7f32", "#d4a574"],
        accentColor: "#deb887",
        shineColor: "rgba(255, 200, 150, 0.5)",
        glowColor: "#cd7f32",
        innerFrameColors: ["#8b4513", "#3d1f0d"],
      };
  }
};

// Composant pour le cadre TCG
function TCGFrame({ status }: { status: CardStatus }) {
  const config = getTextureConfig(status);

  return (
    <>
      {/* Cadre extérieur principal */}
      <View style={styles.outerFrame}>
        <LinearGradient
          colors={config.frameColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Bordure intérieure avec ombre */}
      <View style={styles.innerFrameBorder}>
        <LinearGradient
          colors={config.innerFrameColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Coins ornementaux - Haut Gauche */}
      <View style={[styles.cornerOrnament, styles.topLeftOrnament]}>
        <View
          style={[styles.cornerCircle, { backgroundColor: config.accentColor }]}
        >
          <View
            style={[
              styles.cornerCircleInner,
              { backgroundColor: config.glowColor },
            ]}
          />
        </View>
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineHorizontal,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineVertical,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerDiamond,
            { backgroundColor: config.accentColor },
          ]}
        />
      </View>

      {/* Coins ornementaux - Haut Droit */}
      <View style={[styles.cornerOrnament, styles.topRightOrnament]}>
        <View
          style={[styles.cornerCircle, { backgroundColor: config.accentColor }]}
        >
          <View
            style={[
              styles.cornerCircleInner,
              { backgroundColor: config.glowColor },
            ]}
          />
        </View>
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineHorizontal,
            styles.cornerLineRight,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineVertical,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerDiamond,
            { backgroundColor: config.accentColor },
          ]}
        />
      </View>

      {/* Coins ornementaux - Bas Gauche */}
      <View style={[styles.cornerOrnament, styles.bottomLeftOrnament]}>
        <View
          style={[styles.cornerCircle, { backgroundColor: config.accentColor }]}
        >
          <View
            style={[
              styles.cornerCircleInner,
              { backgroundColor: config.glowColor },
            ]}
          />
        </View>
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineHorizontal,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineVertical,
            styles.cornerLineBottom,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerDiamond,
            { backgroundColor: config.accentColor },
          ]}
        />
      </View>

      {/* Coins ornementaux - Bas Droit */}
      <View style={[styles.cornerOrnament, styles.bottomRightOrnament]}>
        <View
          style={[styles.cornerCircle, { backgroundColor: config.accentColor }]}
        >
          <View
            style={[
              styles.cornerCircleInner,
              { backgroundColor: config.glowColor },
            ]}
          />
        </View>
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineHorizontal,
            styles.cornerLineRight,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerLine,
            styles.cornerLineVertical,
            styles.cornerLineBottom,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.cornerDiamond,
            { backgroundColor: config.accentColor },
          ]}
        />
      </View>

      {/* Décorations latérales - Gauche */}
      <View style={[styles.sideDecoration, styles.leftDecoration]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={`left-${i}`} style={styles.sideOrnamentContainer}>
            <View
              style={[
                styles.sideOrnament,
                { backgroundColor: config.accentColor },
              ]}
            />
            <View
              style={[
                styles.sideOrnamentDot,
                { backgroundColor: config.glowColor },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Décorations latérales - Droite */}
      <View style={[styles.sideDecoration, styles.rightDecoration]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={`right-${i}`} style={styles.sideOrnamentContainer}>
            <View
              style={[
                styles.sideOrnament,
                { backgroundColor: config.accentColor },
              ]}
            />
            <View
              style={[
                styles.sideOrnamentDot,
                { backgroundColor: config.glowColor },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Décoration haut */}
      <View style={[styles.topDecoration]}>
        <View
          style={[
            styles.topOrnamentLine,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.topOrnamentCenter,
            { backgroundColor: config.glowColor },
          ]}
        >
          <Ionicons
            name={
              status === "ruby"
                ? "diamond"
                : status === "platinum"
                  ? "medal"
                  : status === "gold"
                    ? "trophy"
                    : status === "silver"
                      ? "ribbon"
                      : "shield"
            }
            size={16}
            color={config.accentColor}
          />
        </View>
        <View
          style={[
            styles.topOrnamentLine,
            { backgroundColor: config.accentColor },
          ]}
        />
      </View>

      {/* Décoration bas */}
      <View style={[styles.bottomDecoration]}>
        <View
          style={[
            styles.bottomOrnamentWing,
            styles.bottomOrnamentWingLeft,
            { backgroundColor: config.accentColor },
          ]}
        />
        <View
          style={[
            styles.bottomOrnamentCenter,
            { borderColor: config.accentColor },
          ]}
        >
          <Text
            style={[styles.bottomOrnamentText, { color: config.accentColor }]}
          >
            {status.toUpperCase()}
          </Text>
        </View>
        <View
          style={[
            styles.bottomOrnamentWing,
            styles.bottomOrnamentWingRight,
            { backgroundColor: config.accentColor },
          ]}
        />
      </View>

      {/* Filigrane intérieur */}
      <View style={styles.filigreContainer}>
        <View
          style={[
            styles.filigreLine,
            styles.filigreTop,
            { backgroundColor: `${config.accentColor}30` },
          ]}
        />
        <View
          style={[
            styles.filigreLine,
            styles.filigreBottom,
            { backgroundColor: `${config.accentColor}30` },
          ]}
        />
        <View
          style={[
            styles.filigreCorner,
            styles.filigreCornerTL,
            { borderColor: `${config.accentColor}40` },
          ]}
        />
        <View
          style={[
            styles.filigreCorner,
            styles.filigreCornerTR,
            { borderColor: `${config.accentColor}40` },
          ]}
        />
        <View
          style={[
            styles.filigreCorner,
            styles.filigreCornerBL,
            { borderColor: `${config.accentColor}40` },
          ]}
        />
        <View
          style={[
            styles.filigreCorner,
            styles.filigreCornerBR,
            { borderColor: `${config.accentColor}40` },
          ]}
        />
      </View>
    </>
  );
}

function ShinyCard({
  children,
  status = "bronze",
}: {
  children: React.ReactNode;
  status?: string;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    });

  const config = getTextureConfig(status as CardStatus);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(translateY.value, [-150, 0, 150], [-12, 0, 12]);
    const rotateY = interpolate(translateX.value, [-150, 0, 150], [12, 0, -12]);

    return {
      transform: [
        { perspective: 1200 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  const shineAnimatedStyle = useAnimatedStyle(() => {
    const translateXValue = interpolate(
      translateX.value + translateY.value,
      [-300, 0, 300],
      [-CARD_WIDTH * 1.5, 0, CARD_WIDTH * 1.5],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      Math.abs(translateX.value) + Math.abs(translateY.value),
      [0, 30, 100],
      [0, 0.3, 0.8],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateX: translateXValue }, { rotate: "20deg" }],
    };
  });

  const holoAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateX.value) + Math.abs(translateY.value),
      [0, 100, 200],
      [0, 0.2, 0.5],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      translateX.value + translateY.value,
      [-300, 0, 300],
      [-20, 0, 20],
    );

    return {
      opacity,
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.flashcard, cardAnimatedStyle]}>
        {/* Fond de base */}
        <LinearGradient
          colors={config.baseColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Cadre TCG */}
        <TCGFrame status={status as CardStatus} />

        {/* Effet holographique */}
        <Animated.View style={[styles.holoContainer, holoAnimatedStyle]}>
          <LinearGradient
            colors={[
              "rgba(255, 0, 0, 0.1)",
              "rgba(255, 127, 0, 0.1)",
              "rgba(255, 255, 0, 0.1)",
              "rgba(0, 255, 0, 0.1)",
              "rgba(0, 127, 255, 0.1)",
              "rgba(139, 0, 255, 0.1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.holoGradient}
          />
        </Animated.View>

        {/* Bande de brillance */}
        <View style={styles.shineWrapper}>
          <Animated.View style={[styles.shineBand, shineAnimatedStyle]}>
            <LinearGradient
              colors={[
                "transparent",
                config.shineColor,
                "rgba(255, 255, 255, 0.9)",
                config.shineColor,
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        {/* Contenu de la carte */}
        <View style={styles.cardContent}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: card, isLoading } = useQuery({
    queryKey: ["card", id],
    queryFn: () => getCard(Number(id)),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>Card not found</Text>
      </View>
    );
  }

  const progress = card.progress?.find((p) => p.userId === user?.id) || {
    userId: user?.id || 0,
    successCount: 0,
    failureCount: 0,
    currentStreak: 0,
    maxStreak: 0,
    status: "bronze",
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ruby":
        return "#dc2626";
      case "platinum":
        return "#94a3b8";
      case "gold":
        return "#f59e0b";
      case "silver":
        return "#a1a1aa";
      default:
        return "#cd7f32";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "ruby":
        return "diamond";
      case "platinum":
        return "medal";
      case "gold":
        return "trophy";
      case "silver":
        return "ribbon";
      default:
        return "shield";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardContainer}>
          <ShinyCard status={progress.status}>
            <View style={styles.cardInnerContent}>
              <View style={styles.cardSide}>
                <Text style={styles.sideLabel}>FRONT</Text>
                <Text style={styles.cardText}>{card.word}</Text>
              </View>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerDiamond} />
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.cardSide}>
                <Text style={styles.sideLabel}>BACK</Text>
                <Text style={styles.cardText}>{card.translation}</Text>
              </View>
            </View>
          </ShinyCard>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(progress.status) },
            ]}
          >
            <Ionicons
              name={getStatusIcon(progress.status) as any}
              size={24}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {progress.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text style={styles.statValue}>{progress.successCount}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={32} color="#ef4444" />
              <Text style={styles.statValue}>{progress.failureCount}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="flash" size={32} color="#f59e0b" />
              <Text style={styles.statValue}>{progress.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trophy" size={32} color="#3b82f6" />
              <Text style={styles.statValue}>{progress.maxStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          <View style={styles.milestone}>
            <Text style={styles.milestoneTitle}>Next Milestone</Text>
            {progress.maxStreak < 10 && (
              <Text style={styles.milestoneText}>
                🥈 {10 - progress.maxStreak} more correct in a row for Silver
              </Text>
            )}
            {progress.maxStreak >= 10 && progress.maxStreak < 30 && (
              <Text style={styles.milestoneText}>
                🥇 {30 - progress.maxStreak} more correct in a row for Gold
              </Text>
            )}
            {progress.maxStreak >= 30 && progress.maxStreak < 50 && (
              <Text style={styles.milestoneText}>
                💎 {50 - progress.maxStreak} more correct in a row for Platinum
              </Text>
            )}
            {progress.maxStreak >= 50 && progress.maxStreak < 70 && (
              <Text style={styles.milestoneText}>
                ❤️‍🔥 {70 - progress.maxStreak} more correct in a row for Ruby
              </Text>
            )}
            {progress.maxStreak >= 70 && (
              <Text style={styles.milestoneText}>
                🎉 You&apos;ve reached the maximum rank!
              </Text>
            )}
          </View>

          {progress.successCount === 0 && progress.failureCount === 0 && (
            <View style={styles.newCardBanner}>
              <Ionicons name="sparkles" size={24} color="#3b82f6" />
              <Text style={styles.newCardText}>
                New card! Start practicing to track your progress.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  cardContainer: {
    margin: 16,
    minHeight: CARD_HEIGHT,
  },
  flashcard: {
    backgroundColor: "#0a0a0a",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    overflow: "hidden",
    height: CARD_HEIGHT,
  },

  // Cadre extérieur
  outerFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 8,
    borderColor: "transparent",
    zIndex: 1,
  },

  // Bordure intérieure
  innerFrameBorder: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "transparent",
    zIndex: 2,
  },

  // Ornements de coin
  cornerOrnament: {
    position: "absolute",
    width: 40,
    height: 40,
    zIndex: 10,
  },
  topLeftOrnament: {
    top: 12,
    left: 12,
  },
  topRightOrnament: {
    top: 12,
    right: 12,
  },
  bottomLeftOrnament: {
    bottom: 12,
    left: 12,
  },
  bottomRightOrnament: {
    bottom: 12,
    right: 12,
  },
  cornerCircle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cornerLine: {
    position: "absolute",
    backgroundColor: "#fff",
  },
  cornerLineHorizontal: {
    top: 9,
    left: 22,
    width: 18,
    height: 2,
  },
  cornerLineRight: {
    left: undefined,
    right: 22,
  },
  cornerLineVertical: {
    top: 22,
    left: 9,
    width: 2,
    height: 18,
  },
  cornerLineBottom: {
    top: undefined,
    bottom: 22,
  },
  cornerDiamond: {
    position: "absolute",
    width: 8,
    height: 8,
    transform: [{ rotate: "45deg" }],
    top: 28,
    left: 28,
  },

  // Décorations latérales
  sideDecoration: {
    position: "absolute",
    top: 80,
    bottom: 80,
    width: 20,
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 5,
  },
  leftDecoration: {
    left: 14,
  },
  rightDecoration: {
    right: 14,
  },
  sideOrnamentContainer: {
    alignItems: "center",
  },
  sideOrnament: {
    width: 12,
    height: 3,
    borderRadius: 1,
  },
  sideOrnamentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },

  // Décoration haut
  topDecoration: {
    position: "absolute",
    top: 18,
    left: 60,
    right: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  topOrnamentLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  },
  topOrnamentCenter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },

  // Décoration bas
  bottomDecoration: {
    position: "absolute",
    bottom: 16,
    left: 50,
    right: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  bottomOrnamentWing: {
    width: 40,
    height: 3,
    borderRadius: 1,
  },
  bottomOrnamentWingLeft: {
    marginRight: 8,
  },
  bottomOrnamentWingRight: {
    marginLeft: 8,
  },
  bottomOrnamentCenter: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
  },
  bottomOrnamentText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  // Filigrane
  filigreContainer: {
    position: "absolute",
    top: 50,
    left: 40,
    right: 40,
    bottom: 50,
    zIndex: 3,
  },
  filigreLine: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 1,
  },
  filigreTop: {
    top: 0,
  },
  filigreBottom: {
    bottom: 0,
  },
  filigreCorner: {
    position: "absolute",
    width: 15,
    height: 15,
    borderWidth: 1,
  },
  filigreCornerTL: {
    top: -5,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  filigreCornerTR: {
    top: -5,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  filigreCornerBL: {
    bottom: -5,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  filigreCornerBR: {
    bottom: -5,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  // Effets
  holoContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 15,
  },
  holoGradient: {
    width: "200%",
    height: "200%",
    position: "absolute",
    top: "-50%",
    left: "-50%",
  },
  shineWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 20,
  },
  shineBand: {
    position: "absolute",
    width: 80,
    height: CARD_HEIGHT * 2,
    top: -CARD_HEIGHT / 2,
    left: CARD_WIDTH / 2 - 40,
  },

  // Contenu
  cardContent: {
    flex: 1,
    margin: 14,
    borderRadius: 10,
    zIndex: 4,
    justifyContent: "center",
  },
  cardInnerContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  cardSide: {
    alignItems: "center",
    paddingVertical: 24,
  },
  sideLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerDiamond: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 12,
  },

  // Status et Stats
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  milestone: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 16,
    color: "#1e293b",
  },
  newCardBanner: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  newCardText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
  },
});
