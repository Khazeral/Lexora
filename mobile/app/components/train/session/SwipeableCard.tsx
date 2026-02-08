import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
  runOnJS,
} from "react-native-reanimated";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  SWIPE_THRESHOLD,
} from "@/constants/cardDimensions";
import { getStatusColors } from "@/constants/cardColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

export default function SwipeableCard({
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
  }, [cardKey, hintAnimation, translateX, translateY]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

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
          runOnJS(onSwipeRight)();
        }, 300);
      } else if (translationX < -SWIPE_THRESHOLD) {
        setHasAnimated(true);
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 });
        setTimeout(() => {
          runOnJS(onSwipeLeft)();
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
      runOnJS(handleSwipeEnd)(event.translationX);
    });

  const tap = Gesture.Tap()
    .enabled(!hasAnimated)
    .onEnd(() => {
      runOnJS(onFlip)();
    });

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

const styles = StyleSheet.create({
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
});
