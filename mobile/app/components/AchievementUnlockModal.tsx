import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface UnlockedAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface AchievementUnlockedModalProps {
  visible: boolean;
  achievements: UnlockedAchievement[];
  onDismiss: () => void;
}

const { width } = Dimensions.get("window");

const getRarityConfig = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return {
        colors: ["#fbbf24", "#f59e0b", "#d97706"] as const,
        borderColor: "#fbbf24",
        textColor: "#fbbf24",
        label: "LÉGENDAIRE",
      };
    case "epic":
      return {
        colors: ["#a855f7", "#9333ea", "#7c3aed"] as const,
        borderColor: "#a855f7",
        textColor: "#a855f7",
        label: "ÉPIQUE",
      };
    case "rare":
      return {
        colors: ["#3b82f6", "#2563eb", "#1d4ed8"] as const,
        borderColor: "#3b82f6",
        textColor: "#3b82f6",
        label: "RARE",
      };
    default:
      return {
        colors: ["#6b7280", "#4b5563", "#374151"] as const,
        borderColor: "#6b7280",
        textColor: "#9ca3af",
        label: "COMMUN",
      };
  }
};

export default function AchievementUnlockedModal({
  visible,
  achievements,
  onDismiss,
}: AchievementUnlockedModalProps) {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible || achievements.length === 0) return null;

  const achievement = achievements[0];
  const config = getRarityConfig(achievement.rarity);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={50} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />

        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <LinearGradient
            colors={["#1a1a2e", "#16213e", "#1a1a2e"]}
            style={styles.card}
          >
            <View
              style={[
                styles.rarityBadge,
                { backgroundColor: config.borderColor },
              ]}
            >
              <Text style={styles.rarityText}>{config.label}</Text>
            </View>

            <Text style={styles.title}>🏆 Achievement Débloqué!</Text>

            <View
              style={[
                styles.iconContainer,
                { borderColor: config.borderColor },
              ]}
            >
              <LinearGradient
                colors={config.colors}
                style={styles.iconGradient}
              >
                <Ionicons
                  name={achievement.icon as any}
                  size={48}
                  color="#fff"
                />
              </LinearGradient>
            </View>

            <Text style={[styles.achievementName, { color: config.textColor }]}>
              {achievement.name}
            </Text>

            <Text style={styles.description}>{achievement.description}</Text>

            <Pressable style={styles.button} onPress={onDismiss}>
              <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Génial!</Text>
              </LinearGradient>
            </Pressable>

            {achievements.length > 1 && (
              <Text style={styles.moreText}>
                +{achievements.length - 1} autre(s) achievement(s)
              </Text>
            )}
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: width - 48,
    maxWidth: 340,
  },
  card: {
    borderRadius: 24,
    paddingTop: 48,
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  rarityBadge: {
    position: "absolute",
    top: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rarityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
    marginBottom: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  moreText: {
    marginTop: 16,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
});
