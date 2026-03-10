import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { pillShadow } from "../../ui/GlowStyles";

type SessionHeaderProps = {
  deckName: string;
  isReverse: boolean;
  onClose: () => void;
};

export default function SessionHeader({
  deckName,
  isReverse,
  onClose,
}: SessionHeaderProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 py-4 border-b-2 border-border">
        <TouchableOpacity
          onPress={onClose}
          className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
          activeOpacity={0.7}
          style={[pillShadow.sm]}
        >
          <Ionicons name="close" size={24} color="#e8edf5" />
        </TouchableOpacity>

        <View className="flex-1 items-center gap-1 mx-4">
          <Text
            className="text-foreground text-base font-bold tracking-wider"
            numberOfLines={1}
          >
            {deckName.toUpperCase()}
          </Text>
          {isReverse && (
            <View className="flex-row items-center gap-1 bg-success/20 px-3 py-1 rounded-full">
              <Ionicons name="swap-horizontal" size={12} color="#44d9a0" />
              <Text className="text-success text-[10px] font-bold">
                {t("trainSession.header.reverse").toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View className="w-12" />
      </View>
    </SafeAreaView>
  );
}
