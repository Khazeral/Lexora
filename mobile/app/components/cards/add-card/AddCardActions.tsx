import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type AddCardActionsProps = {
  onAdd: () => void;
  onAddAnother: () => void;
  isLoading: boolean;
};

export default function AddCardActions({
  onAdd,
  onAddAnother,
  isLoading,
}: AddCardActionsProps) {
  const { t } = useTranslation();
  const [continueMode, setContinueMode] = useState(false);

  return (
    <View className="p-6 bg-secondary rounded-t-2xl gap-4">
      <View className="flex-row items-center justify-between px-2">
        <Text className="text-muted-foreground text-sm font-semibold">
          {t(
            "cards.addCard.buttons.addAnother",
            "Ajouter une autre carte après",
          )}
        </Text>
        <Switch
          value={continueMode}
          onValueChange={setContinueMode}
          trackColor={{ false: "#1a3d2e", true: "#44d9a0" }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity
        className="py-4 rounded-2xl items-center justify-center flex-row gap-3"
        style={[pillShadow.default, { backgroundColor: "#44d9a0" }]}
        onPress={continueMode ? onAddAnother : onAdd}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#0b3d2e" />
        ) : (
          <>
            <Ionicons
              name={continueMode ? "add-circle" : "checkmark-circle"}
              size={22}
              color="#0b3d2e"
            />
            <Text
              className="text-base font-bold tracking-wider"
              style={{ color: "#0b3d2e" }}
            >
              {continueMode
                ? t("cards.addCard.buttons.addAndContinue").toUpperCase()
                : t("cards.addCard.buttons.addAndFinish").toUpperCase()}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
