import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCard, updateCard, deleteCard } from "@/services/cards.api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Scanlines from "../components/Scanlines";
import AnimatedTouchable from "../components/ui/AnimatedTouchable";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

type CardStatus = "bronze" | "silver" | "gold" | "platinum" | "ruby";

interface TextureConfig {
  baseColors: [string, string, string];
  accentColor: string;
  glowColor: string;
  icon: string;
}

const getTextureConfig = (status: CardStatus): TextureConfig => {
  switch (status) {
    case "ruby":
      return {
        baseColors: ["#2d0a0a", "#4a1010", "#2d0a0a"],
        accentColor: "#fca5a5",
        glowColor: "#dc2626",
        icon: "diamond",
      };
    case "platinum":
      return {
        baseColors: ["#1e293b", "#334155", "#1e293b"],
        accentColor: "#e2e8f0",
        glowColor: "#94a3b8",
        icon: "medal",
      };
    case "gold":
      return {
        baseColors: ["#451a03", "#78350f", "#451a03"],
        accentColor: "#fde047",
        glowColor: "#fbbf24",
        icon: "trophy",
      };
    case "silver":
      return {
        baseColors: ["#27272a", "#3f3f46", "#27272a"],
        accentColor: "#e4e4e7",
        glowColor: "#a1a1aa",
        icon: "ribbon",
      };
    default:
      return {
        baseColors: ["#1c1208", "#2a1a0a", "#1c1208"],
        accentColor: "#deb887",
        glowColor: "#cd7f32",
        icon: "shield",
      };
  }
};

function FlippableCard({
  front,
  back,
  status = "bronze",
  isEditing = false,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  status?: string;
  isEditing?: boolean;
}) {
  const config = getTextureConfig(status as CardStatus);
  const [showBack, setShowBack] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const { t } = useTranslation();

  const scaleX = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const scaleY = useSharedValue(1);

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    translateX.value = withTiming(-40, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(18, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });
    rotateZ.value = withTiming(-8, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });
    scaleY.value = withTiming(0.97, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });

    setTimeout(() => {
      scaleX.value = withTiming(0, {
        duration: 100,
        easing: Easing.in(Easing.cubic),
      });
      translateY.value = withTiming(24, {
        duration: 100,
        easing: Easing.in(Easing.cubic),
      });
    }, 100);

    setTimeout(() => {
      setShowBack((prev) => !prev);

      scaleX.value = withSpring(1, {
        stiffness: 700,
        damping: 25,
        mass: 0.5,
      });
      translateX.value = withSpring(0, {
        stiffness: 260,
        damping: 25,
        mass: 0.8,
      });
      translateY.value = withSpring(0, {
        stiffness: 260,
        damping: 25,
        mass: 0.7,
      });
      rotateZ.value = withSpring(0, {
        stiffness: 220,
        damping: 25,
        mass: 1.9,
      });
      scaleY.value = withSpring(1, {
        stiffness: 320,
        damping: 25,
      });

      setTimeout(() => setIsFlipping(false), 300);
    }, 200);
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 24,
            overflow: "hidden",
            shadowColor: config.glowColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 12,
          },
          cardAnimatedStyle,
        ]}
      >
        <LinearGradient
          colors={config.baseColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 24,
            borderWidth: 4,
            borderColor: isEditing ? "#f5c542" : config.glowColor,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: config.accentColor,
            opacity: 0.3,
          }}
        />

        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
        ].map((position, i) => (
          <View
            key={i}
            style={[
              {
                position: "absolute",
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: config.accentColor,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              },
              position,
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: config.glowColor,
              }}
            />
          </View>
        ))}

        <View
          style={{
            flex: 1,
            zIndex: 25,
            justifyContent: "center",
            padding: 24,
          }}
        >
          {showBack ? back : front}
        </View>
      </Animated.View>

      <AnimatedTouchable
        onPress={handleFlip}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 20,
            borderWidth: 2,
            opacity: isFlipping ? 0.4 : 1,
          },
          pillShadow.sm,
        ]}
        className="bg-card border-border"
        activeOpacity={0.7}
        disabled={isFlipping}
      >
        <Ionicons name="sync" size={20} color="#6e9e8a" />
        <Text className="text-muted-foreground text-sm font-bold tracking-wider">
          {isEditing
            ? showBack
              ? t("cards.detail.flipToQuestion", "VOIR QUESTION")
              : t("cards.detail.flipToAnswer", "VOIR RÉPONSE")
            : showBack
              ? "SHOW ANSWER"
              : "SHOW QUESTION"}
        </Text>
      </AnimatedTouchable>
    </View>
  );
}

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState("");
  const [editTranslation, setEditTranslation] = useState("");

  const { data: card, isLoading } = useQuery({
    queryKey: ["card", id],
    queryFn: () => getCard(Number(id)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      cardId,
      word,
      translation,
    }: {
      cardId: number;
      word: string;
      translation: string;
    }) => updateCard(cardId, { word, translation }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", id] });
      queryClient.invalidateQueries({ queryKey: ["deck"] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cardId: number) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deck"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      router.back();
    },
  });

  const handleStartEdit = () => {
    if (card) {
      setEditWord(card.word);
      setEditTranslation(card.translation);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditWord("");
    setEditTranslation("");
  };

  const handleSaveEdit = () => {
    if (editWord.trim().length > 0 && editTranslation.trim().length > 0) {
      updateMutation.mutate({
        cardId: Number(id),
        word: editWord.trim(),
        translation: editTranslation.trim(),
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t("cards.detail.deleteTitle", "Supprimer la carte"),
      t(
        "cards.detail.deleteMessage",
        "Êtes-vous sûr ? Cette action est irréversible.",
      ),
      [
        { text: t("common.cancel", "Annuler"), style: "cancel" },
        {
          text: t("common.delete", "Supprimer"),
          style: "destructive",
          onPress: () => deleteMutation.mutate(Number(id)),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#e8453c" />
      </View>
    );
  }

  if (!card) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Card not found</Text>
      </View>
    );
  }

  const progress = card.progress?.find((p) => p.userId === user?.id) || {
    userId: user?.id || 0,
    successCount: 0,
    failureCount: 0,
    currentStreak: 0,
    maxStreak: 0,
    status: "bronze" as CardStatus,
  };

  const config = getTextureConfig(progress.status as CardStatus);
  const canSave =
    editWord.trim().length > 0 && editTranslation.trim().length > 0;

  const CardFace = ({
    content,
    label,
    editing,
    onChangeText,
  }: {
    content: string;
    label: string;
    editing?: boolean;
    onChangeText?: (text: string) => void;
  }) => (
    <View
      style={{
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: 28,
        paddingBottom: 20,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: -8,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: editing ? "#f5c542" : config.glowColor,
          zIndex: 30,
        }}
      >
        <Ionicons
          name={editing ? "pencil" : (config.icon as any)}
          size={14}
          color={editing ? "#0b3d2e" : "#fff"}
        />
        <Text
          style={{
            color: editing ? "#0b3d2e" : "#fff",
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 3,
          }}
        >
          {editing
            ? t("cards.detail.editing", "ÉDITION")
            : progress.status.toUpperCase()}
        </Text>
      </View>

      {editing ? (
        <TextInput
          value={content}
          onChangeText={onChangeText}
          multiline
          autoCapitalize="none"
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "left",
            lineHeight: 38,
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
            borderWidth: 1.5,
            borderColor: "rgba(255,255,255,0.35)",
            borderStyle: "dashed",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.15)",
          }}
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      ) : (
        <Text
          adjustsFontSizeToFit
          numberOfLines={10}
          minimumFontScale={0.4}
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "left",
            lineHeight: 42,
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
            paddingHorizontal: 16,
            width: "100%",
          }}
        >
          {content}
        </Text>
      )}

      <View
        style={{
          position: "absolute",
          bottom: -8,
          alignSelf: "center",
          paddingHorizontal: 14,
          paddingVertical: 5,
          borderRadius: 999,
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 30,
        }}
      >
        <Text
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 9,
            fontWeight: "800",
            letterSpacing: 4,
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Scanlines />

      <View className="flex-row items-center justify-between px-6 py-4">
        <AnimatedTouchable
          onPress={() => (isEditing ? handleCancelEdit() : router.back())}
          className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
          style={pillShadow.sm}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isEditing ? "close" : "arrow-back"}
            size={22}
            color={isEditing ? "#e8453c" : "#e8edf5"}
          />
        </AnimatedTouchable>

        <Text className="text-foreground text-lg font-black tracking-[3px]">
          {t("cards.detail.title", "CARTE").toUpperCase()}
        </Text>

        <AnimatedTouchable
          onPress={isEditing ? handleSaveEdit : handleStartEdit}
          disabled={isEditing && !canSave}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isEditing
              ? canSave
                ? "#44d9a0"
                : "#1a5c45"
              : "transparent",
            borderWidth: 2,
            borderColor: isEditing
              ? canSave
                ? "#6ee8b7"
                : "#2a7a60"
              : "#f5c542",
            opacity: isEditing && !canSave ? 0.5 : 1,
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "brush"}
            size={20}
            color={isEditing ? (canSave ? "#0b3d2e" : "#4a7a6a") : "#f5c542"}
          />
        </AnimatedTouchable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-6 mt-6">
          <FlippableCard
            status={progress.status}
            isEditing={isEditing}
            front={
              <CardFace
                content={isEditing ? editWord : card.word}
                label="ANSWER"
                editing={isEditing}
                onChangeText={setEditWord}
              />
            }
            back={
              <CardFace
                content={isEditing ? editTranslation : card.translation}
                label="QUESTION"
                editing={isEditing}
                onChangeText={setEditTranslation}
              />
            }
          />
        </View>

        {isEditing && (
          <View className="px-6 mt-6">
            <AnimatedTouchable
              onPress={handleDelete}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 16,
                borderRadius: 16,
                backgroundColor: "#0d2e22",
                borderWidth: 2,
                borderColor: "#e8453c",
              }}
            >
              <Ionicons name="trash" size={20} color="#e8453c" />
              <Text
                style={{
                  color: "#e8453c",
                  fontSize: 15,
                  fontWeight: "700",
                  letterSpacing: 2,
                }}
              >
                {t("cards.detail.deleteButton", "SUPPRIMER")}
              </Text>
            </AnimatedTouchable>
          </View>
        )}

        {!isEditing && (
          <View className="px-6 mt-8">
            <Text className="text-muted-foreground text-xs font-bold tracking-[3px] mb-4">
              STATISTICS
            </Text>

            <View className="flex-row flex-wrap gap-3 mb-6">
              <StatCard
                icon="checkmark-circle"
                iconColor="#44d9a0"
                bgColor="#1a3d2e"
                value={progress.successCount}
                label="CORRECT"
              />
              <StatCard
                icon="close-circle"
                iconColor="#e8453c"
                bgColor="#3d1a1a"
                value={progress.failureCount}
                label="INCORRECT"
              />
              <StatCard
                icon="flash"
                iconColor="#f5c542"
                bgColor="#3d2e1a"
                value={progress.currentStreak}
                label="STREAK"
              />
              <StatCard
                icon="trophy"
                iconColor="#5b8af5"
                bgColor="#1a3a5c"
                value={progress.maxStreak}
                label="BEST"
              />
            </View>

            <View className="bg-card rounded-2xl p-4 border-2 border-border mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="flag" size={16} color="#f5c542" />
                <Text className="text-muted-foreground text-xs font-bold tracking-wider">
                  NEXT MILESTONE
                </Text>
              </View>
              <Text className="text-foreground text-sm leading-5">
                {getMilestoneText(progress.maxStreak)}
              </Text>
            </View>

            {progress.successCount === 0 && progress.failureCount === 0 && (
              <View
                className="flex-row items-center gap-3 p-4 bg-card rounded-2xl border-2 border-info"
                style={pillShadow.sm}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={[{ backgroundColor: "#1a3a5c" }, pillShadow.sm]}
                >
                  <Ionicons name="sparkles" size={20} color="#5b8af5" />
                </View>
                <Text className="flex-1 text-foreground text-sm">
                  {t(
                    "cards.detail.newCard",
                    "Nouvelle carte ! Entraînez-vous pour suivre votre progression.",
                  )}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getMilestoneText(maxStreak: number): string {
  if (maxStreak < 10)
    return `🥈 ${10 - maxStreak} more correct in a row for Silver`;
  if (maxStreak < 30)
    return `🥇 ${30 - maxStreak} more correct in a row for Gold`;
  if (maxStreak < 50)
    return `💎 ${50 - maxStreak} more correct in a row for Platinum`;
  if (maxStreak < 70)
    return `❤️‍🔥 ${70 - maxStreak} more correct in a row for Ruby`;
  return "🎉 You've reached the maximum rank!";
}

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  value: number;
  label: string;
};

function StatCard({ icon, iconColor, bgColor, value, label }: StatCardProps) {
  return (
    <View className="flex-1 min-w-[45%] bg-card rounded-2xl p-4 items-center border-2 border-border">
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-2 border-2"
        style={[{ backgroundColor: bgColor, borderColor: iconColor }]}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-foreground text-2xl font-black">{value}</Text>
      <Text className="text-muted-foreground text-[10px] font-bold tracking-wider mt-1">
        {label}
      </Text>
    </View>
  );
}
