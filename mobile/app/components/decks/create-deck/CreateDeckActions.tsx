import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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

  return (
    <View className="flex-row gap-3 p-6 bg-secondary border-t-2 border-border">
      <TouchableOpacity
        className="flex-1 py-4 rounded-2xl bg-success items-center justify-center"
        style={[pillShadow.default, { backgroundColor: pillColors.red }]}
        onPress={onCancel}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Text className="text-white text-base font-bold tracking-wider">
          {t("decks.createDeck.buttons.cancel").toUpperCase()}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-2 py-4 px-8 rounded-2xl bg-success items-center justify-center"
        style={[
          pillShadow.default,
          { flex: 2 },
          { backgroundColor: pillColors.blue },
        ]}
        onPress={onSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#0b3d2e" />
        ) : (
          <Text className="text-success-foreground text-base font-bold tracking-wider text-white">
            {t("decks.createDeck.buttons.create").toUpperCase()}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
