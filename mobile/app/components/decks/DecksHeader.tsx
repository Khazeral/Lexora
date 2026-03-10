// DecksHeader.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type DecksHeaderProps = {
  isEditing?: boolean;
  onToggleEdit?: () => void;
  showEditButton?: boolean;
};

export default function DecksHeader({
  isEditing = false,
  onToggleEdit,
  showEditButton = false,
}: DecksHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="px-6 pt-16 pb-4 flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-foreground text-3xl font-black tracking-[4px]">
          {t("decks.title").toUpperCase()}
        </Text>
        <Text className="text-accent text-xs font-bold tracking-[3px] mt-1">
          {t("decks.description").toUpperCase()}
        </Text>
      </View>

      {showEditButton && onToggleEdit && (
        <TouchableOpacity
          onPress={onToggleEdit}
          activeOpacity={0.7}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isEditing ? "#44d9a0" : "transparent",
            borderWidth: 2,
            borderColor: isEditing ? "#6ee8b7" : "#f5c542",
          }}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "brush"}
            size={20}
            color={isEditing ? "#0b3d2e" : "#f5c542"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
