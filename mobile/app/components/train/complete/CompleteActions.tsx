import { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type CompleteActionsProps = {
  deckId: string | string[];
};

export default function CompleteActions({ deckId }: CompleteActionsProps) {
  const { t } = useTranslation();
  const quitScale = useRef(new Animated.Value(1)).current;
  const againScale = useRef(new Animated.Value(1)).current;

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

  return (
    <View className="flex-row gap-3 p-6 bg-secondary border-t-2 border-border">
      <Animated.View style={{ flex: 1, transform: [{ scale: quitScale }] }}>
        <TouchableOpacity
          className="flex-row items-center justify-center gap-3 py-4 rounded-2xl bg-card border-2 border-border"
          style={pillShadow.sm}
          onPress={() => router.push("/(tabs)")}
          onPressIn={() => pressIn(quitScale)}
          onPressOut={() => pressOut(quitScale)}
          activeOpacity={1}
        >
          <Ionicons name="home" size={20} color="#6e9e8a" />
          <Text className="text-muted-foreground text-sm font-bold tracking-wider">
            {t("trainComplete.actions.quit").toUpperCase()}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ flex: 1, transform: [{ scale: againScale }] }}>
        <TouchableOpacity
          className="flex-row items-center justify-center gap-3 py-4 rounded-2xl"
          style={[{ backgroundColor: "#44d9a0" }, pillShadow.default]}
          onPress={() =>
            router.push({
              pathname: "/train/[id]/settings",
              params: { id: deckId },
            })
          }
          onPressIn={() => pressIn(againScale)}
          onPressOut={() => pressOut(againScale)}
          activeOpacity={1}
        >
          <Ionicons name="refresh" size={20} color="#0b3d2e" />
          <Text className="text-[#0b3d2e] text-sm font-bold tracking-wider">
            {t("trainComplete.actions.trainAgain").toUpperCase()}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
