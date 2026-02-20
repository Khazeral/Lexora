import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type CompleteHeaderProps = {
  icon: string;
  color: string;
  title: string;
  deckName?: string;
  isRecord?: boolean;
};

export default function CompleteHeader({
  icon,
  color,
  title,
  deckName,
  isRecord = false,
}: CompleteHeaderProps) {
  return (
    <SafeAreaView edges={["top"]} className="bg-background">
      <View className="items-center py-8 px-6 border-b-2 border-border">
        <View
          className="w-28 h-28 rounded-3xl items-center justify-center mb-4"
          style={[
            { backgroundColor: color },
            pillShadow.default,
            isRecord && {
              shadowColor: color,
              shadowOpacity: 0.6,
              shadowRadius: 20,
            },
          ]}
        >
          <Ionicons name={icon as any} size={56} color="#fff" />
        </View>

        {isRecord && (
          <View
            className="flex-row items-center gap-2 px-4 py-2 rounded-full mb-3"
            style={[{ backgroundColor: "#f5c542" }, pillShadow.sm]}
          >
            <Ionicons name="trophy" size={16} color="#0b3d2e" />
            <Text className="text-[#0b3d2e] text-xs font-black tracking-wider">
              NEW RECORD
            </Text>
          </View>
        )}

        <Text className="text-foreground text-2xl font-black tracking-wider text-center mb-2">
          {title.toUpperCase()}
        </Text>

        {deckName && (
          <Text className="text-muted-foreground text-base text-center">
            {deckName}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
