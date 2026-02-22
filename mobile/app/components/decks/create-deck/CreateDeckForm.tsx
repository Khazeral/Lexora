import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { pillShadow } from "@/app/components/ui/GlowStyles";

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
    <View className="gap-6">
      <View className="items-center py-6">
        <View
          className="w-20 h-20 rounded-2xl bg-info items-center justify-center mb-4"
          style={pillShadow.sm}
        >
          <Ionicons name="albums" size={40} color="#fff" />
        </View>
        <Text className="text-muted-foreground text-sm text-center px-6">
          {t("decks.createDeck.description")}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-foreground text-sm font-bold tracking-wider">
          {t("decks.createDeck.form.nameLabel").toUpperCase()}
          <Text className="text-destructive"> *</Text>
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
            <View
              className={`bg-card rounded-2xl px-4 py-4 border-2 ${
                errors.name ? "border-destructive" : "border-border"
              }`}
              style={pillShadow.sm}
            >
              <TextInput
                className="text-foreground text-base"
                placeholder={t("decks.createDeck.form.namePlaceholder")}
                placeholderTextColor="#6e9e8a"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
              />
            </View>
          )}
        />
        {errors.name && (
          <Text className="text-destructive text-xs ml-1">
            {errors.name.message}
          </Text>
        )}
      </View>

      <View className="gap-2">
        <Text className="text-foreground text-sm font-bold tracking-wider">
          {t("decks.createDeck.form.descriptionLabel").toUpperCase()}
        </Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              className="bg-card rounded-2xl px-4 py-4 border-2 border-border"
              style={pillShadow.sm}
            >
              <TextInput
                className="text-foreground text-base min-h-[100px]"
                placeholder={t("decks.createDeck.form.descriptionPlaceholder")}
                placeholderTextColor="#6e9e8a"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}
