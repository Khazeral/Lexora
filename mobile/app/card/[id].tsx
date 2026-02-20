import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated as RNAnimated,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCard } from "@/services/cards.api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import { useRef, useState } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

type CardStatus = "bronze" | "silver" | "gold" | "platinum" | "ruby";

interface TextureConfig {
  baseColors: [string, string, string];
  accentColor: string;
  shineColor: string;
  glowColor: string;
  icon: string;
}

const getTextureConfig = (status: CardStatus): TextureConfig => {
  switch (status) {
    case "ruby":
      return {
        baseColors: ["#2d0a0a", "#4a1010", "#2d0a0a"],
        accentColor: "#fca5a5",
        shineColor: "rgba(255, 200, 200, 0.6)",
        glowColor: "#dc2626",
        icon: "diamond",
      };
    case "platinum":
      return {
        baseColors: ["#1e293b", "#334155", "#1e293b"],
        accentColor: "#e2e8f0",
        shineColor: "rgba(255, 255, 255, 0.7)",
        glowColor: "#94a3b8",
        icon: "medal",
      };
    case "gold":
      return {
        baseColors: ["#451a03", "#78350f", "#451a03"],
        accentColor: "#fde047",
        shineColor: "rgba(255, 230, 150, 0.6)",
        glowColor: "#fbbf24",
        icon: "trophy",
      };
    case "silver":
      return {
        baseColors: ["#27272a", "#3f3f46", "#27272a"],
        accentColor: "#e4e4e7",
        shineColor: "rgba(255, 255, 255, 0.5)",
        glowColor: "#a1a1aa",
        icon: "ribbon",
      };
    default:
      return {
        baseColors: ["#1c1208", "#2a1a0a", "#1c1208"],
        accentColor: "#deb887",
        shineColor: "rgba(255, 200, 150, 0.5)",
        glowColor: "#cd7f32",
        icon: "shield",
      };
  }
};

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
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 24,
            overflow: "hidden",
          },
          {
            shadowColor: config.glowColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 12,
          },
          cardAnimatedStyle,
        ]}
      >
        <LinearGradient
          colors={config.baseColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <View
          className="absolute inset-0 rounded-3xl border-4"
          style={{ borderColor: config.glowColor }}
        />

        <View
          className="absolute rounded-2xl border-2 opacity-30"
          style={{
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderColor: config.accentColor,
          }}
        />

        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
        ].map((position, i) => (
          <View
            key={i}
            style={[
              {
                position: "absolute",
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: config.accentColor,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              },
              position,
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: config.glowColor,
              }}
            />
          </View>
        ))}

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
                width: 100,
                height: CARD_HEIGHT * 2,
                top: -CARD_HEIGHT / 2,
                left: CARD_WIDTH / 2 - 50,
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

        <View className="flex-1 z-[25] justify-center p-6">{children}</View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [showBack, setShowBack] = useState(false);

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
    status: "bronze" as CardStatus,
  };

  const config = getTextureConfig(progress.status as CardStatus);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
          <View className="mx-6 mt-6">
            <ShinyCard status={progress.status}>
              <View
                className="absolute top-4 self-center px-5 py-2 rounded-full flex-row items-center gap-2 z-30"
                style={{ backgroundColor: config.glowColor }}
              >
                <Ionicons name={config.icon as any} size={16} color="#fff" />
                <Text className="text-white text-[11px] font-black tracking-widest">
                  {progress.status.toUpperCase()}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center px-4">
                <Text
                  className="text-3xl font-bold text-center text-white leading-10"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 4,
                  }}
                >
                  {showBack ? card.translation : card.word}
                </Text>
              </View>

              <View
                className="absolute bottom-4 self-center px-4 py-1.5 rounded-full z-30"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <Text className="text-white/70 text-[10px] font-bold tracking-widest">
                  {showBack ? "QUESTION" : "ANSWER"}
                </Text>
              </View>
            </ShinyCard>
            <View className="flex-row justify-end mt-5">
              <TouchableOpacity
                onPress={() => setShowBack(!showBack)}
                className="flex-row items-center gap-2 px-5 py-3 rounded-xl bg-card border-2 border-border"
                style={pillShadow.sm}
                activeOpacity={0.7}
              >
                <Ionicons name="swap-horizontal" size={20} color="#6e9e8a" />
                <Text className="text-muted-foreground text-sm font-bold tracking-wider">
                  {showBack ? "SHOW ANSWER" : "SHOW QUESTION"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-6 mt-8">
            <Text className="text-muted-foreground text-xs font-bold tracking-[3px] mb-4">
              STATISTICS
            </Text>

            <View className="flex-row flex-wrap gap-3 mb-6">
              <StatCard
                icon="checkmark-circle"
                iconColor="#44d9a0"
                bgColor="#1a3d2e"
                value={progress.successCount}
                label="CORRECT"
              />
              <StatCard
                icon="close-circle"
                iconColor="#e8453c"
                bgColor="#3d1a1a"
                value={progress.failureCount}
                label="INCORRECT"
              />
              <StatCard
                icon="flash"
                iconColor="#f5c542"
                bgColor="#3d2e1a"
                value={progress.currentStreak}
                label="STREAK"
              />
              <StatCard
                icon="trophy"
                iconColor="#5b8af5"
                bgColor="#1a3a5c"
                value={progress.maxStreak}
                label="BEST"
              />
            </View>

            <View
              className="bg-card rounded-2xl p-4 border-2 border-border mb-4"
              style={pillShadow.sm}
            >
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="flag" size={16} color="#f5c542" />
                <Text className="text-muted-foreground text-xs font-bold tracking-wider">
                  NEXT MILESTONE
                </Text>
              </View>
              <Text className="text-foreground text-sm leading-5">
                {getMilestoneText(progress.maxStreak)}
              </Text>
            </View>

            {progress.successCount === 0 && progress.failureCount === 0 && (
              <View
                className="flex-row items-center gap-3 p-4 bg-card rounded-2xl border-2 border-info"
                style={pillShadow.sm}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={[{ backgroundColor: "#1a3a5c" }, pillShadow.sm]}
                >
                  <Ionicons name="sparkles" size={20} color="#5b8af5" />
                </View>
                <Text className="flex-1 text-foreground text-sm">
                  New card! Start practicing to track your progress.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function getMilestoneText(maxStreak: number): string {
  if (maxStreak < 10) {
    return `🥈 ${10 - maxStreak} more correct in a row for Silver`;
  }
  if (maxStreak < 30) {
    return `🥇 ${30 - maxStreak} more correct in a row for Gold`;
  }
  if (maxStreak < 50) {
    return `💎 ${50 - maxStreak} more correct in a row for Platinum`;
  }
  if (maxStreak < 70) {
    return `❤️‍🔥 ${70 - maxStreak} more correct in a row for Ruby`;
  }
  return "🎉 You've reached the maximum rank!";
}

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  value: number;
  label: string;
};

function StatCard({ icon, iconColor, bgColor, value, label }: StatCardProps) {
  return (
    <View
      className="flex-1 min-w-[45%] bg-card rounded-2xl p-4 items-center border-2 border-border"
      style={pillShadow.sm}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-2 border-2"
        style={[
          { backgroundColor: bgColor, borderColor: iconColor },
          pillShadow.sm,
        ]}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-foreground text-2xl font-black">{value}</Text>
      <Text className="text-muted-foreground text-[10px] font-bold tracking-wider mt-1">
        {label}
      </Text>
    </View>
  );
}
