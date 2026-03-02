import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { pillShadow } from "@/app/components/ui/GlowStyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const STATUS_COLORS: Record<
  string,
  { bg: [string, string, string]; border: string }
> = {
  bronze: {
    bg: ["#2a1a0a", "#1c1208", "#2a1a0a"],
    border: "#cd7f32",
  },
  silver: {
    bg: ["#3f3f46", "#27272a", "#3f3f46"],
    border: "#a1a1aa",
  },
  gold: {
    bg: ["#78350f", "#451a03", "#78350f"],
    border: "#fbbf24",
  },
  platinum: {
    bg: ["#334155", "#1e293b", "#334155"],
    border: "#94a3b8",
  },
  ruby: {
    bg: ["#4a1010", "#2d0a0a", "#4a1010"],
    border: "#dc2626",
  },
};

interface FlashCardProps {
  cardKey: string;
  status?: string;
  isFlipped: boolean;
  frontText: string;
  frontLabel: string;
  backText: string;
  backLabel: string;
  onFlip: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function FlashCard({
  cardKey,
  status = "bronze",
  isFlipped,
  frontText,
  frontLabel,
  backText,
  backLabel,
  onFlip,
  onCorrect,
  onIncorrect,
}: FlashCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const missScale = useRef(new Animated.Value(1)).current;
  const hitScale = useRef(new Animated.Value(1)).current;
  const colors = STATUS_COLORS[status] || STATUS_COLORS.bronze;

  const pressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    flipAnim.setValue(0);
    buttonsAnim.setValue(0);
  }, [cardKey]);

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 180 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (isFlipped) {
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 200,
        delay: 150,
        useNativeDriver: true,
      }).start();
    } else {
      buttonsAnim.setValue(0);
    }
  }, [isFlipped]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const buttonsOpacity = buttonsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const buttonsTranslateY = buttonsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View className="items-center">
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onFlip}
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <Animated.View
          style={[
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              position: "absolute",
              backfaceVisibility: "hidden",
              borderRadius: 24,
              overflow: "hidden",
              transform: [{ rotateY: frontInterpolate }],
            },
            pillShadow.card,
            { shadowColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={colors.bg}
            style={{ flex: 1, padding: 32, justifyContent: "center" }}
          >
            <View
              className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl border-2"
              style={{ borderColor: colors.border }}
            />

            <View
              className="absolute top-4 self-center px-4 py-1.5 rounded-full"
              style={{ backgroundColor: colors.border }}
            >
              <Text className="text-white text-[10px] font-black tracking-wider">
                {status.toUpperCase()}
              </Text>
            </View>

            <View className="items-center">
              <Text
                className="text-[10px] font-bold tracking-widest mb-4 opacity-60"
                style={{ color: colors.border }}
              >
                {frontLabel.toUpperCase()}
              </Text>
              <Text
                className="text-3xl font-bold text-center text-white"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.5)",
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                {frontText}
              </Text>
            </View>

            <View className="absolute bottom-6 self-center flex-row items-center gap-2 opacity-50">
              <Ionicons name="hand-left" size={18} color="#fff" />
              <Text className="text-white text-xs">Tap to reveal</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              position: "absolute",
              backfaceVisibility: "hidden",
              borderRadius: 24,
              overflow: "hidden",
              transform: [{ rotateY: backInterpolate }],
            },
            pillShadow.card,
            { shadowColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={colors.bg}
            style={{ flex: 1, padding: 32, justifyContent: "center" }}
          >
            <View
              className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl border-2"
              style={{ borderColor: colors.border }}
            />

            <View className="items-center">
              <Text
                className="text-[10px] font-bold tracking-widest mb-4 opacity-60"
                style={{ color: colors.border }}
              >
                {backLabel.toUpperCase()}
              </Text>
              <Text
                className="text-3xl font-bold text-center text-white"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.5)",
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                {backText}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        className="flex-row gap-4 mt-6"
        style={{
          opacity: buttonsOpacity,
          transform: [{ translateY: buttonsTranslateY }],
        }}
        pointerEvents={isFlipped ? "auto" : "none"}
      >
        <Animated.View style={{ flex: 1, transform: [{ scale: missScale }] }}>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-3 py-5 rounded-2xl border-2"
            style={[
              { backgroundColor: "#3d1a1a", borderColor: "#e8453c" },
              pillShadow.default,
            ]}
            onPress={onIncorrect}
            onPressIn={() => pressIn(missScale)}
            onPressOut={() => pressOut(missScale)}
            activeOpacity={1}
          >
            <Ionicons name="close" size={24} color="#e8453c" />
            <Text className="text-destructive text-lg font-black tracking-wider">
              MISS
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ flex: 1, transform: [{ scale: hitScale }] }}>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-3 py-5 rounded-2xl border-2"
            style={[
              { backgroundColor: "#1a3d2e", borderColor: "#44d9a0" },
              pillShadow.default,
            ]}
            onPress={onCorrect}
            onPressIn={() => pressIn(hitScale)}
            onPressOut={() => pressOut(hitScale)}
            activeOpacity={1}
          >
            <Ionicons name="checkmark" size={24} color="#44d9a0" />
            <Text className="text-success text-lg font-black tracking-wider">
              HIT !
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
