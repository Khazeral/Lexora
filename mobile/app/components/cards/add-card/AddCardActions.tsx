import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";

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

  return (
    <View className="gap-3 p-6 bg-secondary border-t-2 border-border">
      {/* Primary Action - Add & Finish (full width) */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-3 py-5 rounded-2xl"
        style={[pillShadow.default, { backgroundColor: pillColors.green }]}
        onPress={onAdd}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#0b3d2e" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#0b3d2e" />
            <Text
              className="text-base font-black tracking-wider"
              style={{ color: "#0b3d2e" }}
            >
              AJOUTER LA CARTE
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Secondary Action - Add Another (full width, outlined) */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-3 py-4 rounded-2xl bg-card border-2 border-info"
        style={pillShadow.sm}
        onPress={onAddAnother}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#5b8af5" />
        ) : (
          <>
            <Ionicons name="add-circle" size={22} color="#5b8af5" />
            <Text className="text-info text-sm font-bold tracking-wider">
              AJOUTER ET CONTINUER
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
