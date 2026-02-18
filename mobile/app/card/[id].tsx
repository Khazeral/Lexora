import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { pillShadow } from "@/app/components/ui/GlowStyles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;

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
        baseColors: ["#2d0a0a", "#4a1010", "#2d0a0a"],
        frameColors: ["#ff6b6b", "#dc2626", "#991b1b", "#dc2626", "#ff6b6b"],
        accentColor: "#fca5a5",
        shineColor: "rgba(255, 200, 200, 0.6)",
        glowColor: "#dc2626",
        innerFrameColors: ["#7f1d1d", "#450a0a"],
      };
    case "platinum":
      return {
        baseColors: ["#1e293b", "#334155", "#1e293b"],
        frameColors: ["#f1f5f9", "#94a3b8", "#64748b", "#94a3b8", "#f1f5f9"],
        accentColor: "#e2e8f0",
        shineColor: "rgba(255, 255, 255, 0.7)",
        glowColor: "#94a3b8",
        innerFrameColors: ["#475569", "#1e293b"],
      };
    case "gold":
      return {
        baseColors: ["#451a03", "#78350f", "#451a03"],
        frameColors: ["#fef08a", "#fbbf24", "#f59e0b", "#fbbf24", "#fef08a"],
        accentColor: "#fde047",
        shineColor: "rgba(255, 230, 150, 0.6)",
        glowColor: "#fbbf24",
        innerFrameColors: ["#92400e", "#451a03"],
      };
    case "silver":
      return {
        baseColors: ["#27272a", "#3f3f46", "#27272a"],
        frameColors: ["#ffffff", "#d4d4d8", "#a1a1aa", "#d4d4d8", "#ffffff"],
        accentColor: "#e4e4e7",
        shineColor: "rgba(255, 255, 255, 0.5)",
        glowColor: "#a1a1aa",
        innerFrameColors: ["#52525b", "#27272a"],
      };
    default: // bronze
      return {
        baseColors: ["#1c1208", "#2a1a0a", "#1c1208"],
        frameColors: ["#e8b896", "#cd7f32", "#8b5a2b", "#cd7f32", "#e8b896"],
        accentColor: "#deb887",
        shineColor: "rgba(255, 200, 150, 0.5)",
        glowColor: "#cd7f32",
        innerFrameColors: ["#5c3d2e", "#2a1a0a"],
      };
  }
};

function TCGFrame({ status }: { status: CardStatus }) {
  const config = getTextureConfig(status);

  return (
    <>
      {/* Outer Frame - Gradient border */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
          borderWidth: 4,
          borderColor: config.glowColor,
          zIndex: 1,
        }}
      />

      {/* Inner glow border */}
      <View
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          right: 4,
          bottom: 4,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: config.accentColor,
          opacity: 0.5,
          zIndex: 2,
        }}
      />

      {/* Top Decoration with icon */}
      <View className="absolute top-3 left-12 right-12 flex-row items-center justify-center z-10">
        <View
          className="flex-1 h-0.5 rounded-full"
          style={{ backgroundColor: config.accentColor, opacity: 0.6 }}
        />
        <View
          className="w-10 h-10 rounded-full items-center justify-center mx-3 border-2"
          style={{
            backgroundColor: config.glowColor,
            borderColor: config.accentColor,
          }}
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
            size={18}
            color="#fff"
          />
        </View>
        <View
          className="flex-1 h-0.5 rounded-full"
          style={{ backgroundColor: config.accentColor, opacity: 0.6 }}
        />
      </View>

      {/* Bottom Decoration with status label */}
      <View className="absolute bottom-3 left-10 right-10 flex-row items-center justify-center z-10">
        <View
          className="w-12 h-0.5 rounded-full"
          style={{ backgroundColor: config.accentColor, opacity: 0.6 }}
        />
        <View
          className="px-4 py-1.5 rounded-full mx-3"
          style={{
            backgroundColor: config.glowColor,
            shadowColor: config.glowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            className="text-[11px] font-black tracking-[2px]"
            style={{ color: "#fff" }}
          >
            {status.toUpperCase()}
          </Text>
        </View>
        <View
          className="w-12 h-0.5 rounded-full"
          style={{ backgroundColor: config.accentColor, opacity: 0.6 }}
        />
      </View>

      {/* Corner gems/ornaments */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((position, i) => (
        <View
          key={i}
          style={[
            {
              position: "absolute",
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: config.accentColor,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              shadowColor: config.glowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              elevation: 3,
            },
            position,
          ]}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: config.glowColor,
            }}
          />
        </View>
      ))}
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
      <Animated.View
        style={[
          {
            borderRadius: 20,
            overflow: "hidden",
            height: CARD_HEIGHT,
          },
          {
            shadowColor: config.glowColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          },
          cardAnimatedStyle,
        ]}
      >
        {/* Base gradient background */}
        <LinearGradient
          colors={config.baseColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Inner content area with subtle gradient */}
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={[
              `${config.glowColor}15`,
              `${config.glowColor}05`,
              `${config.glowColor}10`,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </View>

        <TCGFrame status={status as CardStatus} />

        {/* Holo Effect */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              zIndex: 15,
            },
            holoAnimatedStyle,
          ]}
        >
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
            style={{
              width: "200%",
              height: "200%",
              position: "absolute",
              top: "-50%",
              left: "-50%",
            }}
          />
        </Animated.View>

        {/* Shine Band */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 80,
                height: CARD_HEIGHT * 2,
                top: -CARD_HEIGHT / 2,
                left: CARD_WIDTH / 2 - 40,
              },
              shineAnimatedStyle,
            ]}
          >
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
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </Animated.View>
        </View>

        <View className="flex-1 m-5 rounded-xl z-[4] justify-center">
          {children}
        </View>
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
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#e8453c" />
      </View>
    );
  }

  if (!card) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Card not found</Text>
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
        return "#f5c542";
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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b-2 border-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
          style={pillShadow.sm}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#e8edf5" />
        </TouchableOpacity>
        <Text className="text-foreground text-lg font-bold tracking-wider">
          CARD DETAILS
        </Text>
        <View className="w-12" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Card Container */}
        <View className="mx-6 mt-6" style={{ minHeight: CARD_HEIGHT }}>
          <ShinyCard status={progress.status}>
            <View className="flex-1 px-6 py-8 justify-center">
              {/* Front */}
              <View className="items-center py-5">
                <View
                  className="px-4 py-1 rounded-full mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Text className="text-[10px] font-bold text-white/60 tracking-[3px]">
                    FRONT
                  </Text>
                </View>
                <Text
                  className="text-3xl font-bold text-white text-center"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 6,
                  }}
                >
                  {card.word}
                </Text>
              </View>

              {/* Divider */}
              <View className="flex-row items-center px-4 my-4">
                <View className="flex-1 h-px bg-white/20" />
                <View
                  className="w-3 h-3 rotate-45 mx-4"
                  style={{ backgroundColor: getStatusColor(progress.status) }}
                />
                <View className="flex-1 h-px bg-white/20" />
              </View>

              {/* Back */}
              <View className="items-center py-5">
                <View
                  className="px-4 py-1 rounded-full mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Text className="text-[10px] font-bold text-white/60 tracking-[3px]">
                    BACK
                  </Text>
                </View>
                <Text
                  className="text-3xl font-bold text-white text-center"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 6,
                  }}
                >
                  {card.translation}
                </Text>
              </View>
            </View>
          </ShinyCard>
        </View>

        {/* Status Badge */}
        <View className="items-center mt-6 mb-4">
          <View
            className="flex-row items-center gap-2 px-6 py-3 rounded-full"
            style={[
              { backgroundColor: getStatusColor(progress.status) },
              pillShadow.default,
            ]}
          >
            <Ionicons
              name={getStatusIcon(progress.status) as any}
              size={22}
              color="#fff"
            />
            <Text className="text-white text-base font-black tracking-wider">
              {progress.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-6 mt-4">
          <Text className="text-muted-foreground text-xs font-bold tracking-[3px] mb-4">
            STATISTICS
          </Text>

          {/* Stats Grid */}
          <View className="flex-row flex-wrap gap-3 mb-6">
            <StatCard
              icon="checkmark-circle"
              iconColor="#44d9a0"
              value={progress.successCount}
              label="CORRECT"
            />
            <StatCard
              icon="close-circle"
              iconColor="#e8453c"
              value={progress.failureCount}
              label="INCORRECT"
            />
            <StatCard
              icon="flash"
              iconColor="#f5c542"
              value={progress.currentStreak}
              label="STREAK"
            />
            <StatCard
              icon="trophy"
              iconColor="#5b8af5"
              value={progress.maxStreak}
              label="BEST"
            />
          </View>

          {/* Milestone */}
          <View
            className="bg-card rounded-2xl p-4 border-2 border-border mb-4"
            style={pillShadow.sm}
          >
            <Text className="text-muted-foreground text-xs font-bold tracking-wider mb-2">
              NEXT MILESTONE
            </Text>
            <Text className="text-foreground text-base">
              {progress.maxStreak < 10 &&
                `🥈 ${10 - progress.maxStreak} more correct in a row for Silver`}
              {progress.maxStreak >= 10 &&
                progress.maxStreak < 30 &&
                `🥇 ${30 - progress.maxStreak} more correct in a row for Gold`}
              {progress.maxStreak >= 30 &&
                progress.maxStreak < 50 &&
                `💎 ${50 - progress.maxStreak} more correct in a row for Platinum`}
              {progress.maxStreak >= 50 &&
                progress.maxStreak < 70 &&
                `❤️‍🔥 ${70 - progress.maxStreak} more correct in a row for Ruby`}
              {progress.maxStreak >= 70 &&
                "🎉 You've reached the maximum rank!"}
            </Text>
          </View>

          {/* New Card Banner */}
          {progress.successCount === 0 && progress.failureCount === 0 && (
            <View
              className="flex-row items-center gap-3 p-4 bg-card rounded-2xl border-2 border-info"
              style={pillShadow.sm}
            >
              <View
                className="w-10 h-10 rounded-xl bg-info items-center justify-center"
                style={pillShadow.sm}
              >
                <Ionicons name="sparkles" size={20} color="#fff" />
              </View>
              <Text className="flex-1 text-foreground text-sm">
                New card! Start practicing to track your progress.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: number;
  label: string;
};

function StatCard({ icon, iconColor, value, label }: StatCardProps) {
  return (
    <View
      className="flex-1 min-w-[45%] bg-card rounded-2xl p-4 items-center border-2 border-border"
      style={pillShadow.sm}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-2"
        style={[{ backgroundColor: iconColor }, pillShadow.sm]}
      >
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text className="text-foreground text-2xl font-bold">{value}</Text>
      <Text className="text-muted-foreground text-[10px] font-bold tracking-wider mt-1">
        {label}
      </Text>
    </View>
  );
}
