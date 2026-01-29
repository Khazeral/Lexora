import { Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type CompleteHeaderProps = {
  icon: string;
  colors: string[];
  title: string;
  deckName?: string;
  scaleAnim: Animated.Value;
  pulseAnim?: Animated.Value;
  isRecord?: boolean;
};

export default function CompleteHeader({
  icon,
  colors,
  title,
  deckName,
  scaleAnim,
  pulseAnim,
  isRecord = false,
}: CompleteHeaderProps) {
  return (
    <LinearGradient colors={colors} style={styles.headerGradient}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: isRecord && pulseAnim ? pulseAnim : scaleAnim },
            ],
          },
        ]}
      >
        <Ionicons name={icon as any} size={64} color="#fff" />
      </Animated.View>
      <Text style={styles.headerTitle}>{title}</Text>
      {deckName && <Text style={styles.headerSubtitle}>{deckName}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
});
