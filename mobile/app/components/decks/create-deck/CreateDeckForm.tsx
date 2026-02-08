import { View, Text, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../../Input";

type CreateDeckFormProps = {
  control: any;
  errors: any;
};

export default function CreateDeckForm({
  control,
  errors,
}: CreateDeckFormProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.form}>
      <View style={styles.illustration}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>📚</Text>
        </View>
        <Text style={styles.illustrationText}>
          Create a new deck to organize your flashcards
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("decks.createDeck.form.nameLabel")}
          <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="name"
          rules={{
            required: t("decks.createDeck.form.nameRequired"),
            minLength: {
              value: 3,
              message: t("decks.createDeck.form.nameMinLength"),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("decks.createDeck.form.namePlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.name}
              autoFocus
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("decks.createDeck.form.descriptionLabel")}
        </Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("decks.createDeck.form.descriptionPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 24,
  },
  illustration: {
    alignItems: "center",
    paddingVertical: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 40,
  },
  illustrationText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  required: {
    color: "#ef4444",
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
