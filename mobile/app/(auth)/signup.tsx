import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/services/auth_context";
import Input from "../components/Input";
import Button from "../components/Button";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);

    try {
      await signup(data.username, data.email, data.password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Header />
        <SignupForm
          control={control}
          errors={errors}
          password={password}
          onSubmit={handleSubmit(onSubmit)}
          loading={loading}
        />
        <Footer />
      </View>
    </KeyboardAvoidingView>
  );
}

const Header = () => {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.title}>{t("auth.signup.title")}</Text>
      <Text style={styles.subtitle}>{t("auth.signup.subtitle")}</Text>
    </>
  );
};

type SignupFormProps = {
  control: any;
  errors: any;
  password: string;
  onSubmit: () => void;
  loading: boolean;
};

const SignupForm = ({
  control,
  errors,
  password,
  onSubmit,
  loading,
}: SignupFormProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="username"
        rules={{
          required: t("auth.signup.errors.usernameRequired"),
          minLength: {
            value: 3,
            message: t("auth.signup.errors.usernameMinLength"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              placeholder={t("auth.signup.username")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              editable={!loading}
              error={!!errors.username}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{
          required: t("auth.signup.errors.emailRequired"),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t("auth.signup.errors.emailInvalid"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              placeholder={t("auth.signup.email")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              error={!!errors.email}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: t("auth.signup.errors.passwordRequired"),
          minLength: {
            value: 6,
            message: t("auth.signup.errors.passwordMinLength"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              placeholder={t("auth.signup.password")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              editable={!loading}
              error={!!errors.password}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: t("auth.signup.errors.confirmPasswordRequired"),
          validate: (value) =>
            value === password || t("auth.signup.errors.passwordsNotMatch"),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              placeholder={t("auth.signup.confirmPassword")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              editable={!loading}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
        )}
      />

      <Button
        title={t("auth.signup.createAccount")}
        onPress={onSubmit}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{t("auth.signup.hasAccount")} </Text>
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.linkText}>{t("auth.signup.signIn")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
