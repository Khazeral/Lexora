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

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      await login(data.email, data.password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Invalid credentials",
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
        <LoginForm
          control={control}
          errors={errors}
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
      <Text style={styles.title}>{t("auth.login.title")}</Text>
      <Text style={styles.subtitle}>{t("auth.login.subtitle")}</Text>
    </>
  );
};

type LoginFormProps = {
  control: any;
  errors: any;
  onSubmit: () => void;
  loading: boolean;
};

const LoginForm = ({ control, errors, onSubmit, loading }: LoginFormProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        rules={{
          required: t("auth.login.errors.emailRequired"),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t("auth.login.errors.emailInvalid"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              placeholder={t("auth.login.email")}
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
          required: t("auth.login.errors.passwordRequired"),
          minLength: {
            value: 6,
            message: t("auth.login.errors.passwordMinLength"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              placeholder={t("auth.login.password")}
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

      <Button
        title={t("auth.login.signIn")}
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
      <Text style={styles.footerText}>{t("auth.login.noAccount")} </Text>
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.linkText}>{t("auth.login.signUp")}</Text>
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
