import { useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import { pillColors, pillShadow } from "@/app/components/ui/GlowStyles";

type CreateDeckActionsProps = {
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
};

export default function CreateDeckActions({
  onSubmit,
  onCancel,
  isLoading,
}: CreateDeckActionsProps) {
  const { t } = useTranslation();
  const cancelScale = useRef(new Animated.Value(1)).current;
  const submitScale = useRef(new Animated.Value(1)).current;

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
    <View className="flex-row gap-3 p-6 bg-secondary rounded-t-2xl">
      <Animated.View style={{ transform: [{ scale: cancelScale }] }}>
        <TouchableOpacity
          className="py-4 px-6 rounded-2xl items-center justify-center"
          style={[pillShadow.default, { backgroundColor: pillColors.red }]}
          onPress={onCancel}
          onPressIn={() => pressIn(cancelScale)}
          onPressOut={() => pressOut(cancelScale)}
          disabled={isLoading}
          activeOpacity={1}
        >
          <Text className="text-white text-base font-bold tracking-wider">
            {t("decks.createDeck.buttons.cancel").toUpperCase()}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ flex: 1, transform: [{ scale: submitScale }] }}>
        <TouchableOpacity
          className="py-4 px-8 rounded-2xl items-center justify-center"
          style={[pillShadow.default, { backgroundColor: pillColors.blue }]}
          onPress={onSubmit}
          onPressIn={() => pressIn(submitScale)}
          onPressOut={() => pressOut(submitScale)}
          disabled={isLoading}
          activeOpacity={1}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold tracking-wider">
              {t("decks.createDeck.buttons.create").toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
