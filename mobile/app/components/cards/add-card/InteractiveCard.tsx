import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type InteractiveCardProps = {
  control: any;
  errors: any;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 420;

export default function InteractiveCard({
  control,
  errors,
}: InteractiveCardProps) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructions}>
        <View style={styles.instructionIcon}>
          <Ionicons name="hand-left-outline" size={20} color="#3b82f6" />
        </View>
        <Text style={styles.instructionsText}>
          {t("cards.addCard.instructions")}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Pressable
          style={[styles.card, flipped && styles.cardFlipped]}
          onPress={handleFlip}
        >
          <View style={[styles.badge, flipped && styles.badgeFlipped]}>
            <Ionicons
              name={flipped ? "reader" : "document-text"}
              size={14}
              color="#fff"
            />
            <Text style={styles.badgeText}>
              {flipped
                ? t("cards.addCard.form.back")
                : t("cards.addCard.form.front")}
            </Text>
          </View>

          <View style={styles.cardContent}>
            <View style={[styles.cardFace, flipped && styles.faceHidden]}>
              <View style={styles.labelContainer}>
                <Ionicons name="text-outline" size={18} color="#64748b" />
                <Text style={styles.cardLabel}>
                  {t("cards.addCard.form.wordLabel")}{" "}
                  <Text style={styles.required}>*</Text>
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
                    style={[styles.cardInput, errors.word && styles.inputError]}
                    placeholder={t("cards.addCard.form.wordPlaceholder")}
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    placeholderTextColor="#cbd5e1"
                    multiline
                    textAlign="center"
                    maxLength={100}
                    editable={!flipped}
                    pointerEvents={flipped ? "none" : "auto"}
                  />
                )}
              />

              {errors.word && !flipped && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ef4444" />
                  <Text style={styles.errorText}>{errors.word.message}</Text>
                </View>
              )}
            </View>

            <View style={[styles.cardFace, !flipped && styles.faceHidden]}>
              <View style={styles.labelContainer}>
                <Ionicons name="language-outline" size={18} color="#64748b" />
                <Text style={styles.cardLabel}>
                  {t("cards.addCard.form.translationLabel")}{" "}
                  <Text style={styles.required}>*</Text>
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
                      styles.cardInput,
                      errors.translation && styles.inputError,
                    ]}
                    placeholder={t("cards.addCard.form.translationPlaceholder")}
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    placeholderTextColor="#cbd5e1"
                    multiline
                    textAlign="center"
                    maxLength={100}
                    editable={flipped}
                    pointerEvents={!flipped ? "none" : "auto"}
                  />
                )}
              />

              {errors.translation && flipped && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ef4444" />
                  <Text style={styles.errorText}>
                    {errors.translation.message}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.flipButtonContainer}>
            <Pressable style={styles.flipButton} onPress={handleFlip}>
              <Ionicons name="sync-outline" size={18} color="#3b82f6" />
              <Text style={styles.flipButtonText}>
                {flipped
                  ? t("cards.addCard.flipToFront")
                  : t("cards.addCard.flipToBack")}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
            </Pressable>
          </View>
        </Pressable>

        {/* Ombre de la carte */}
        <View style={styles.cardShadow} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#64748b"
          />
          <Text style={styles.footerText}>{t("cards.addCard.hint")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  instructions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  instructionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
    lineHeight: 20,
  },
  cardContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  cardFlipped: {
    backgroundColor: "#fefce8",
    borderColor: "#fef08a",
  },
  cardShadow: {
    position: "absolute",
    bottom: -8,
    width: CARD_WIDTH - 40,
    height: 20,
    backgroundColor: "#cbd5e1",
    borderRadius: 100,
    opacity: 0.2,
    zIndex: -1,
  },
  badge: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeFlipped: {
    backgroundColor: "#eab308",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  cardFace: {
    gap: 20,
    alignItems: "center",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  faceHidden: {
    opacity: 0,
    zIndex: -1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  required: {
    color: "#ef4444",
  },
  cardInput: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    width: "100%",
    minHeight: 120,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderStyle: "dashed",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
    borderStyle: "solid",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
  },
  flipButtonContainer: {
    marginTop: 16,
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#eff6ff",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#bfdbfe",
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6",
  },
  footer: {
    gap: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
  },
  footerText: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
});
