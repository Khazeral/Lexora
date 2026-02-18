import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { pillShadow } from "../ui/GlowStyles";

type EmptyDecksProps = {
  hasSearchQuery?: boolean;
};

export default function EmptyDecks({
  hasSearchQuery = false,
}: EmptyDecksProps) {
  const { t } = useTranslation();

  if (hasSearchQuery) {
    return (
      <View className="items-center justify-center pt-20 px-8">
        <View
          className="w-20 h-20 rounded-2xl bg-card border-2 border-border items-center justify-center mb-6"
          style={pillShadow.sm}
        >
          <Ionicons name="search-outline" size={40} color="#6e9e8a" />
        </View>
        <Text className="text-foreground text-xl font-bold tracking-wider mb-2">
          NO RESULTS
        </Text>
        <Text className="text-muted-foreground text-sm text-center">
          Try adjusting your search
        </Text>
      </View>
    );
  }

  return (
    <View className="items-center justify-center pt-20 px-8">
      <View
        className="w-24 h-24 rounded-2xl bg-card border-2 border-border items-center justify-center mb-6"
        style={pillShadow.sm}
      >
        <Ionicons name="albums-outline" size={48} color="#5b8af5" />
      </View>
      <Text className="text-foreground text-xl font-bold tracking-wider mb-2">
        {t("decks.empty.title").toUpperCase()}
      </Text>
      <Text className="text-muted-foreground text-sm text-center mb-8">
        {t("decks.empty.subtitle")}
      </Text>
      <TouchableOpacity
        className="flex-row items-center gap-2 px-6 py-4 rounded-2xl bg-info"
        style={pillShadow.default}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text className="text-white font-bold tracking-wider text-base">
          {t("decks.empty.createButton").toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
