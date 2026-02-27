import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();

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
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-6">
        <AuthHeader />

        <LoginForm
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          loading={loading}
          t={t}
        />

        <Footer
          text={t("auth.login.noAccount")}
          linkText={t("auth.login.signUp")}
          onPress={() => router.push("/(auth)/signup")}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function AuthHeader() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim, sparkleAnim]);

  return (
    <View className="items-center mb-10">
      <View className="mb-4 relative">
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim }, { rotate: "-6deg" }],
          }}
        >
          <View
            className="w-24 h-24 rounded-3xl items-center justify-center overflow-hidden"
            style={[{ backgroundColor: "#e8453c" }, pillShadow.default]}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                className="absolute w-full h-[1px] bg-white opacity-[0.04]"
                style={{ top: i * 5 }}
              />
            ))}

            <View className="absolute left-2 opacity-40">
              <Ionicons name="caret-back" size={16} color="#fff" />
            </View>

            <View
              className="absolute w-9 h-12 rounded-lg bg-white items-center justify-center"
              style={{
                left: 18,
                top: 24,
                transform: [{ rotate: "-8deg" }],
              }}
            >
              <Text style={{ color: "#e8453c" }} className="text-xl font-black">
                ?
              </Text>
            </View>

            <View
              className="absolute w-9 h-12 rounded-lg bg-white items-center justify-center"
              style={{
                right: 18,
                top: 24,
                transform: [{ rotate: "8deg" }],
              }}
            >
              <Ionicons name="checkmark" size={22} color="#f5c542" />
            </View>

            <View className="absolute right-2 opacity-40">
              <Ionicons name="caret-forward" size={16} color="#fff" />
            </View>
          </View>

          <Animated.View
            className="absolute -top-2 -right-2"
            style={{ transform: [{ scale: sparkleAnim }] }}
          >
            <Text className="text-accent text-xl">✦</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <Text className="text-foreground text-3xl font-black tracking-[6px]">
        LEXORA
      </Text>
      <Text className="text-accent text-xs font-bold tracking-[4px] mt-1">
        LEARN VOCABULARY
      </Text>
    </View>
  );
}

type AuthInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  icon: string;
};

function AuthInput({
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true,
  icon,
}: AuthInputProps) {
  return (
    <View
      className={`flex-row items-center bg-card rounded-2xl border-2 px-4 ${
        error ? "border-destructive" : "border-border"
      }`}
      style={pillShadow.sm}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={error ? "#e8453c" : "#6e9e8a"}
      />
      <TextInput
        className="flex-1 py-4 px-3 text-foreground text-base"
        placeholder={placeholder}
        placeholderTextColor="#6e9e8a"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
    </View>
  );
}

type LoginFormProps = {
  control: any;
  errors: any;
  onSubmit: () => void;
  loading: boolean;
  t: (key: string) => string;
};

function LoginForm({ control, errors, onSubmit, loading, t }: LoginFormProps) {
  return (
    <View className="gap-4">
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
            <AuthInput
              icon="mail-outline"
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
              <Text className="text-destructive text-xs mt-2 ml-2">
                {errors.email.message}
              </Text>
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
            <AuthInput
              icon="lock-closed-outline"
              placeholder={t("auth.login.password")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              editable={!loading}
              error={!!errors.password}
            />
            {errors.password && (
              <Text className="text-destructive text-xs mt-2 ml-2">
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        className={`flex-row items-center justify-center gap-3 py-5 rounded-2xl mt-4 ${
          loading ? "opacity-70" : ""
        }`}
        style={[{ backgroundColor: "#44d9a0" }, pillShadow.default]}
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#0b3d2e" />
        ) : (
          <>
            <Ionicons name="log-in-outline" size={22} color="#0b3d2e" />
            <Text className="text-[#0b3d2e] text-base font-bold tracking-wider">
              {t("auth.login.signIn").toUpperCase()}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

type FooterProps = {
  text: string;
  linkText: string;
  onPress: () => void;
};

function Footer({ text, linkText, onPress }: FooterProps) {
  return (
    <View className="flex-row justify-center mt-8">
      <Text className="text-muted-foreground text-sm">{text} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-info text-sm font-bold">{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}
