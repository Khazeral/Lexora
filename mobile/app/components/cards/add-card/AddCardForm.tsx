import { View, Text, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../../Input";

type AddCardFormProps = {
  control: any; //TODO
  errors: any;
};

export default function AddCardForm({ control, errors }: AddCardFormProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("cards.addCard.form.wordLabel")}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="word"
          rules={{
            required: t("cards.addCard.form.wordRequired"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("cards.addCard.form.wordPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.word}
              autoFocus
              autoCapitalize="none"
            />
          )}
        />
        {errors.word && (
          <Text style={styles.errorText}>{errors.word.message}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {t("cards.addCard.form.translationLabel")}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="translation"
          rules={{
            required: t("cards.addCard.form.translationRequired"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("cards.addCard.form.translationPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.translation}
              autoCapitalize="none"
            />
          )}
        />
        {errors.translation && (
          <Text style={styles.errorText}>{errors.translation.message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
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
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
