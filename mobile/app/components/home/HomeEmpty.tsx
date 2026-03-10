import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/services/auth_context";
import { pillShadow } from "@/app/components/ui/GlowStyles";

export default function HomeEmpty() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const steps = [
    {
      icon: "albums",
      color: "#5b8af5",
      title: t("home.empty.step1Title", "Créer un deck"),
      description: t("home.empty.step1Desc", "Organisez vos cartes par thème"),
    },
    {
      icon: "add-circle",
      color: "#a855f7",
      title: t("home.empty.step2Title", "Ajouter des cartes"),
      description: t(
        "home.empty.step2Desc",
        "Question d'un côté, réponse de l'autre",
      ),
    },
    {
      icon: "barbell",
      color: "#44d9a0",
      title: t("home.empty.step3Title", "S'entraîner"),
      description: t(
        "home.empty.step3Desc",
        "Plusieurs modes de jeu vous attendent",
      ),
    },
  ];

  return (
    <View className="px-6 gap-6">
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-black tracking-[3px]">
          {t("home.empty.welcome", {
            name: user?.username?.toUpperCase() || "",
          })}
        </Text>
        <Text className="text-muted-foreground text-sm">
          {t(
            "home.empty.subtitle",
            "Commencez par créer votre premier deck pour mémoriser du vocabulaire.",
          )}
        </Text>
      </View>

      <View className="gap-4">
        {steps.map((step, index) => (
          <View
            key={index}
            className="flex-row items-center gap-4 bg-card rounded-2xl p-4 border border-border/50"
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: step.color }}
            >
              <Ionicons name={step.icon as any} size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: step.color + "30" }}
                >
                  <Text
                    className="text-[10px] font-black"
                    style={{ color: step.color }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text className="text-foreground text-sm font-bold tracking-wider">
                  {step.title.toUpperCase()}
                </Text>
              </View>
              <Text className="text-muted-foreground text-xs mt-1">
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center gap-3 py-4 rounded-2xl"
        style={[pillShadow.default, { backgroundColor: "#5b8af5" }]}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text className="text-white text-base font-bold tracking-wider">
          {t("home.empty.createDeck", "CRÉER MON PREMIER DECK").toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
