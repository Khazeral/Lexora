import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function HomeHeader() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim, sparkleAnim]);

  return (
    <View className="pt-24 pb-4 items-center">
      <View className="mb-4 relative">
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim }, { rotate: "-6deg" }],
          }}
        >
          <View
            className="w-24 h-24 rounded-3xl items-center justify-center overflow-hidden"
            style={[{ backgroundColor: "#e8453c" }, pillShadow.default]}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                className="absolute w-full h-[1px] bg-white opacity-[0.04]"
                style={{ top: i * 5 }}
              />
            ))}

            <View className="absolute left-2 opacity-40">
              <Ionicons name="caret-back" size={16} color="#fff" />
            </View>

            <View
              className="absolute w-9 h-12 rounded-lg bg-white items-center justify-center"
              style={{
                left: 18,
                top: 24,
                transform: [{ rotate: "-8deg" }],
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text style={{ color: "#e8453c" }} className="text-xl font-black">
                ?
              </Text>
            </View>

            <View
              className="absolute w-9 h-12 rounded-lg bg-white items-center justify-center"
              style={{
                right: 18,
                top: 24,
                transform: [{ rotate: "8deg" }],
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="checkmark" size={22} color="#f5c542" />
            </View>

            <View className="absolute right-2 opacity-40">
              <Ionicons name="caret-forward" size={16} color="#fff" />
            </View>
          </View>

          <Animated.View
            className="absolute -top-2 -right-2"
            style={{
              transform: [{ scale: sparkleAnim }],
            }}
          >
            <Text className="text-accent text-xl">✦</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <Text className="text-foreground text-3xl font-black tracking-[6px]">
        LEXORA
      </Text>
      <Text className="text-accent text-xs font-bold tracking-[2px] mt-1">
        {t("home.description")}
      </Text>
    </View>
  );
}
