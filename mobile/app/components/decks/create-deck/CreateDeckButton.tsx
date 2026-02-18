import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

export default function CreateDeckButton() {
  const { t } = useTranslation();

  return (
    <Link href="/deck/create" asChild>
      <TouchableOpacity
        className="absolute right-6 bottom-8 flex-row items-center gap-2 px-6 py-4 rounded-2xl bg-info"
        style={pillShadow.default}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text className="text-white text-base font-bold tracking-wider">
          {t("decks.create").toUpperCase()}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
