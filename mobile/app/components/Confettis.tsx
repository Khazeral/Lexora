import { View, StyleSheet, Animated } from "react-native";

type ConfettiProps = {
  animations: {
    translateY: Animated.Value;
    translateX: Animated.Value;
    rotate: Animated.Value;
    opacity: Animated.Value;
  }[];
};

export default function Confetti({ animations }: ConfettiProps) {
  const colors = [
    "#fbbf24",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {animations.map((anim, index) => {
        const color = colors[index % colors.length];
        const size = Math.random() * 8 + 6;
        const leftPosition = `${(index / animations.length) * 100}%`;

        return (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                backgroundColor: color,
                width: size,
                height: size,
                left: leftPosition,
                transform: [
                  { translateY: anim.translateY },
                  { translateX: anim.translateX },
                  {
                    rotate: anim.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
                opacity: anim.opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  confetti: {
    position: "absolute",
    borderRadius: 4,
  },
});
