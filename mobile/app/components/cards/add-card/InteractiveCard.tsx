import { View, Text, TextInput, Pressable, Dimensions } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState, useImperativeHandle, forwardRef } from "react";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type InteractiveCardProps = {
  control: any;
  errors: any;
};

export type InteractiveCardRef = {
  resetFlip: () => void;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 420;

const InteractiveCard = forwardRef<InteractiveCardRef, InteractiveCardProps>(
  function InteractiveCard({ control, errors }, ref) {
    const { t } = useTranslation();
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
      setFlipped(!flipped);
    };

    useImperativeHandle(ref, () => ({
      resetFlip: () => {
        setFlipped(false);
      },
    }));

    return (
      <View className="gap-5">
        <View
          className="flex-row items-center gap-3 p-4 bg-card rounded-2xl border-2 border-info"
          style={pillShadow.sm}
        >
          <View
            className="w-10 h-10 rounded-xl bg-info items-center justify-center"
            style={pillShadow.sm}
          >
            <Ionicons name="hand-left-outline" size={20} color="#fff" />
          </View>
          <Text className="flex-1 text-foreground text-sm leading-5">
            {t("cards.addCard.instructions")}
          </Text>
        </View>

        <View className="items-center my-2">
          <Pressable
            onPress={handleFlip}
            style={[
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: 24,
                padding: 24,
                borderWidth: 3,
              },
              flipped
                ? { backgroundColor: "#fef9e7", borderColor: "#f5c542" }
                : { backgroundColor: "#f5f5f0", borderColor: "#d4d4c8" },
              pillShadow.card,
            ]}
          >
            <View
              className="absolute top-5 right-5 flex-row items-center gap-1.5 px-4 py-2 rounded-full"
              style={[
                { backgroundColor: flipped ? "#f5c542" : "#5b8af5" },
                pillShadow.sm,
              ]}
            >
              <Ionicons
                name={flipped ? "reader" : "document-text"}
                size={14}
                color={flipped ? "#1a1a1a" : "#fff"}
              />
              <Text
                className="text-xs font-black tracking-widest"
                style={{ color: flipped ? "#1a1a1a" : "#fff" }}
              >
                {flipped
                  ? t("cards.addCard.form.back").toUpperCase()
                  : t("cards.addCard.form.front").toUpperCase()}
              </Text>
            </View>

            <View className="flex-1 justify-center relative">
              <View
                className="gap-5 items-center absolute w-full top-0 bottom-0 justify-center"
                style={flipped ? { opacity: 0, zIndex: -1 } : {}}
              >
                <View
                  className="flex-row items-center gap-2 px-4 py-2 rounded-full"
                  style={{ backgroundColor: "#e8e8e0" }}
                >
                  <Ionicons name="text-outline" size={16} color="#666" />
                  <Text
                    className="text-xs font-bold tracking-wider"
                    style={{ color: "#666" }}
                  >
                    {t("cards.addCard.form.wordLabel").toUpperCase()}
                    <Text style={{ color: "#e8453c" }}> *</Text>
                  </Text>
                </View>

                <Controller
                  control={control}
                  name="word"
                  rules={{
                    required: t("cards.addCard.form.wordRequired"),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        {
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#1a1a1a",
                          textAlign: "center",
                          width: "100%",
                          minHeight: 120,
                          padding: 20,
                          borderRadius: 16,
                          borderWidth: 2,
                          borderStyle: "dashed",
                        },
                        errors.word
                          ? {
                              borderColor: "#e8453c",
                              backgroundColor: "#fef2f2",
                            }
                          : { borderColor: "#c4c4b8", backgroundColor: "#fff" },
                      ]}
                      placeholder={t("cards.addCard.form.wordPlaceholder")}
                      placeholderTextColor="#999"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      multiline
                      textAlign="center"
                      maxLength={100}
                      editable={!flipped}
                      pointerEvents={flipped ? "none" : "auto"}
                    />
                  )}
                />

                {errors.word && !flipped && (
                  <View
                    className="flex-row items-center gap-2 px-3 py-2 rounded-lg"
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

              <View
                className="gap-5 items-center absolute w-full top-0 bottom-0 justify-center"
                style={!flipped ? { opacity: 0, zIndex: -1 } : {}}
              >
                <View
                  className="flex-row items-center gap-2 px-4 py-2 rounded-full"
                  style={{ backgroundColor: "#fef3c7" }}
                >
                  <Ionicons name="language-outline" size={16} color="#92400e" />
                  <Text
                    className="text-xs font-bold tracking-wider"
                    style={{ color: "#92400e" }}
                  >
                    {t("cards.addCard.form.translationLabel").toUpperCase()}
                    <Text style={{ color: "#e8453c" }}> *</Text>
                  </Text>
                </View>

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
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#1a1a1a",
                          textAlign: "center",
                          width: "100%",
                          minHeight: 120,
                          padding: 20,
                          borderRadius: 16,
                          borderWidth: 2,
                          borderStyle: "dashed",
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
                      placeholder={t(
                        "cards.addCard.form.translationPlaceholder",
                      )}
                      placeholderTextColor="#999"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      multiline
                      textAlign="center"
                      maxLength={100}
                      editable={flipped}
                      pointerEvents={!flipped ? "none" : "auto"}
                    />
                  )}
                />

                {errors.translation && flipped && (
                  <View
                    className="flex-row items-center gap-2 px-3 py-2 rounded-lg"
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
            </View>

            <View className="mt-4">
              <Pressable
                className="flex-row items-center justify-center gap-2 py-3 px-5 rounded-full"
                style={{
                  backgroundColor: flipped ? "#fef3c7" : "#e0e7ff",
                  borderWidth: 2,
                  borderColor: flipped ? "#f5c542" : "#5b8af5",
                }}
                onPress={handleFlip}
              >
                <Ionicons
                  name="sync-outline"
                  size={18}
                  color={flipped ? "#92400e" : "#3b82f6"}
                />
                <Text
                  className="text-sm font-bold"
                  style={{ color: flipped ? "#92400e" : "#3b82f6" }}
                >
                  {flipped
                    ? t("cards.addCard.flipToFront")
                    : t("cards.addCard.flipToBack")}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={flipped ? "#92400e" : "#3b82f6"}
                />
              </Pressable>
            </View>
          </Pressable>

          <View
            className="absolute -bottom-2 rounded-full opacity-30"
            style={{
              width: CARD_WIDTH - 40,
              height: 20,
              backgroundColor: "#000",
              zIndex: -1,
            }}
          />
        </View>
      </View>
    );
  },
);

export default InteractiveCard;
