import { View, Text, TextInput, Pressable, Dimensions } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState, useImperativeHandle, forwardRef, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type InteractiveCardProps = {
  control: any;
  errors: any;
};

export type InteractiveCardRef = {
  resetFlip: () => void;
};

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.6;

const InteractiveCard = forwardRef<InteractiveCardRef, InteractiveCardProps>(
  function InteractiveCard({ control, errors }, ref) {
    const { t } = useTranslation();
    const [flipped, setFlipped] = useState(false);
    const rotation = useSharedValue(0);

    const handleFlip = useCallback(() => {
      const toValue = flipped ? 0 : 180;
      rotation.value = withTiming(toValue, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      setTimeout(() => {
        setFlipped((prev) => !prev);
      }, 250);
    }, [flipped]);

    useImperativeHandle(ref, () => ({
      resetFlip: () => {
        rotation.value = withTiming(0, { duration: 400 });
        setTimeout(() => setFlipped(false), 200);
      },
    }));

    const frontAnimatedStyle = useAnimatedStyle(() => {
      const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
      return {
        transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
        backfaceVisibility: "hidden",
      };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
      const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
      return {
        transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
        backfaceVisibility: "hidden",
      };
    });

    const cardStyle = {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 24,
      padding: 20,
      borderWidth: 3,
      position: "absolute" as const,
    };

    return (
      <View className="gap-5">
        <View
          className="items-center my-2"
          style={{ height: CARD_HEIGHT + 20 }}
        >
          {/* Front — Question */}
          <Animated.View
            pointerEvents={flipped ? "none" : "auto"}
            style={[
              cardStyle,
              {
                backgroundColor: "#f5f5f0",
                borderColor: "#d4d4c8",
              },
              pillShadow.card,
              frontAnimatedStyle,
            ]}
          >
            <Pressable
              onPress={handleFlip}
              style={[
                {
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: "#5b8af5",
                },
                pillShadow.sm,
              ]}
            >
              <Ionicons name="sync-outline" size={14} color="#fff" />
              <Text
                className="text-xs font-black tracking-widest"
                style={{ color: "#fff" }}
              >
                QUESTION
              </Text>
            </Pressable>

            <View className="flex-1 mt-14">
              <Controller
                control={control}
                name="word"
                rules={{ required: t("cards.addCard.form.wordRequired") }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      {
                        flex: 1,
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "#1a1a1a",
                        textAlign: "left",
                        textAlignVertical: "top",
                        borderRadius: 16,
                        borderWidth: 2,
                        borderStyle: "dashed",
                        padding: 20,
                      },
                      errors.word
                        ? {
                            borderColor: "#e8453c",
                            backgroundColor: "#fef2f2",
                          }
                        : {
                            borderColor: "#c4c4b8",
                            backgroundColor: "#fff",
                          },
                    ]}
                    placeholder={t("cards.addCard.form.wordPlaceholder")}
                    placeholderTextColor="#999"
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    multiline
                    maxLength={100}
                  />
                )}
              />
              {errors.word && (
                <View
                  className="flex-row items-center gap-2 px-3 py-2 rounded-lg mt-2"
                  style={{ backgroundColor: "#fef2f2" }}
                >
                  <Ionicons name="alert-circle" size={14} color="#e8453c" />
                  <Text
                    style={{
                      color: "#e8453c",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {errors.word.message}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Back — Réponse */}
          <Animated.View
            pointerEvents={flipped ? "auto" : "none"}
            style={[
              cardStyle,
              {
                backgroundColor: "#fef9e7",
                borderColor: "#f5c542",
              },
              pillShadow.card,
              backAnimatedStyle,
            ]}
          >
            <Pressable
              onPress={handleFlip}
              style={[
                {
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: "#f5c542",
                },
                pillShadow.sm,
              ]}
            >
              <Ionicons name="sync-outline" size={14} color="#1a1a1a" />
              <Text
                className="text-xs font-black tracking-widest"
                style={{ color: "#1a1a1a" }}
              >
                RÉPONSE
              </Text>
            </Pressable>

            <View className="flex-1 mt-14">
              <Controller
                control={control}
                name="translation"
                rules={{
                  required: t("cards.addCard.form.translationRequired"),
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      {
                        flex: 1,
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "#1a1a1a",
                        textAlign: "left",
                        textAlignVertical: "top",
                        borderRadius: 16,
                        borderWidth: 2,
                        borderStyle: "dashed",
                        padding: 20,
                      },
                      errors.translation
                        ? {
                            borderColor: "#e8453c",
                            backgroundColor: "#fef2f2",
                          }
                        : {
                            borderColor: "#f5c542",
                            backgroundColor: "#fffef5",
                          },
                    ]}
                    placeholder={t("cards.addCard.form.translationPlaceholder")}
                    placeholderTextColor="#999"
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    multiline
                    maxLength={100}
                  />
                )}
              />
              {errors.translation && (
                <View
                  className="flex-row items-center gap-2 px-3 py-2 rounded-lg mt-2"
                  style={{ backgroundColor: "#fef2f2" }}
                >
                  <Ionicons name="alert-circle" size={14} color="#e8453c" />
                  <Text
                    style={{
                      color: "#e8453c",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {errors.translation.message}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    );
  },
);

export default InteractiveCard;
