import { View, Text } from "react-native";
import { pillShadow } from "@/app/components/ui/GlowStyles";

export default function HomeHeader() {
  return (
    <View className="pt-14 pb-4 items-center">
      {/* Logo icon - red with rotation and sparkle */}
      <View className="mb-4">
        <View
          className="w-20 h-20 rounded-2xl items-center justify-center"
          style={[
            { backgroundColor: "#e85a5a", transform: [{ rotate: "-8deg" }] },
            pillShadow.default,
          ]}
        >
          <Text className="text-4xl font-bold text-white">言</Text>
        </View>
        {/* Sparkle */}
        <View className="absolute -top-1 -right-1">
          <Text className="text-accent text-xl">✦</Text>
        </View>
      </View>

      {/* App name */}
      <Text className="text-foreground text-3xl font-black tracking-[6px]">
        LEXORA
      </Text>
      <Text className="text-accent text-xs font-bold tracking-[4px] mt-1">
        LEARN VOCABULARY
      </Text>
    </View>
  );
}
