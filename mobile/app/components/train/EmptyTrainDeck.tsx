import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";

export default function EmptyTrainDecks() {
  const { t } = useTranslation();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim, pulseAnim]);

  return (
    <View className="items-center pt-12 px-8">
      <Animated.View
        className="mb-8"
        style={{ transform: [{ translateY: floatAnim }, { rotate: "4deg" }] }}
      >
        <View
          className="w-36 h-44 rounded-3xl bg-card border-2 border-border items-center justify-center"
          style={pillShadow.card}
        >
          {Array.from({ length: 22 }).map((_, i) => (
            <View
              key={i}
              className="absolute w-full h-[1px] bg-white opacity-[0.02]"
              style={{ top: i * 8 }}
            />
          ))}

          <View
            className="w-28 h-36 rounded-2xl border-2 border-dashed items-center justify-center"
            style={{ backgroundColor: "#0a1f18", borderColor: "#44d9a0" }}
          >
            <View
              className="w-14 h-14 rounded-xl items-center justify-center border-2"
              style={[
                { backgroundColor: "#1a3d2e", borderColor: "#44d9a0" },
                pillShadow.sm,
              ]}
            >
              <Ionicons name="barbell" size={28} color="#44d9a0" />
            </View>

            <Text
              className="text-[10px] font-bold tracking-widest mt-3"
              style={{ color: "#44d9a0" }}
            >
              TRAIN
            </Text>
          </View>

          <View className="absolute -top-2 -right-2">
            <Text className="text-accent text-lg">✦</Text>
          </View>
        </View>
      </Animated.View>

      <Text className="text-foreground text-2xl font-black tracking-widest mb-2 text-center">
        {t("train.empty.noDeck.title").toUpperCase()}
      </Text>

      <Text className="text-muted-foreground text-sm text-center leading-5 mb-8 max-w-[260px]">
        {t("train.empty.noDeck.subtitle")}
      </Text>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 py-3 rounded-2xl border-2"
          style={[
            { backgroundColor: pillColors.blue, borderColor: "#7ba3f7" },
            pillShadow.default,
          ]}
          onPress={() => router.push("/deck/create")}
          activeOpacity={0.8}
        >
          <View
            className="w-9 h-9 rounded-xl items-center justify-center border-2"
            style={{ backgroundColor: "#1a3a5c", borderColor: "#5b8af5" }}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </View>
          <Text className="text-white font-black tracking-widest text-base">
            {t("train.empty.noDeck.button").toUpperCase()}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
