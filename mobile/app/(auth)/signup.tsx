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
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { t } = useTranslation();

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
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />

        <SignupForm
          control={control}
          errors={errors}
          password={password}
          onSubmit={handleSubmit(onSubmit)}
          loading={loading}
          t={t}
        />

        <Footer
          text={t("auth.signup.hasAccount")}
          linkText={t("auth.signup.signIn")}
          onPress={() => router.push("/(auth)/login")}
        />
      </ScrollView>
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
    <View className="items-center mb-8">
      <View className="mb-4 relative">
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim }, { rotate: "-6deg" }],
          }}
        >
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center overflow-hidden"
            style={[{ backgroundColor: "#e8453c" }, pillShadow.default]}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <View
                key={i}
                className="absolute w-full h-[1px] bg-white opacity-[0.04]"
                style={{ top: i * 5 }}
              />
            ))}

            <View className="absolute left-1.5 opacity-40">
              <Ionicons name="caret-back" size={12} color="#fff" />
            </View>

            <View
              className="absolute w-7 h-9 rounded-md bg-white items-center justify-center"
              style={{
                left: 14,
                top: 20,
                transform: [{ rotate: "-8deg" }],
              }}
            >
              <Text
                style={{ color: "#e8453c" }}
                className="text-base font-black"
              >
                ?
              </Text>
            </View>

            <View
              className="absolute w-7 h-9 rounded-md bg-white items-center justify-center"
              style={{
                right: 14,
                top: 20,
                transform: [{ rotate: "8deg" }],
              }}
            >
              <Ionicons name="checkmark" size={18} color="#f5c542" />
            </View>

            <View className="absolute right-1.5 opacity-40">
              <Ionicons name="caret-forward" size={12} color="#fff" />
            </View>
          </View>

          <Animated.View
            className="absolute -top-1.5 -right-1.5"
            style={{ transform: [{ scale: sparkleAnim }] }}
          >
            <Text className="text-accent text-base">✦</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <Text className="text-foreground text-2xl font-black tracking-[4px]">
        LEXORA
      </Text>
      <Text className="text-accent text-[10px] font-bold tracking-[3px] mt-1">
        CREATE ACCOUNT
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

type SignupFormProps = {
  control: any;
  errors: any;
  password: string;
  onSubmit: () => void;
  loading: boolean;
  t: (key: string) => string;
};

function SignupForm({
  control,
  errors,
  password,
  onSubmit,
  loading,
  t,
}: SignupFormProps) {
  return (
    <View className="gap-4">
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
            <AuthInput
              icon="person-outline"
              placeholder={t("auth.signup.username")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              editable={!loading}
              error={!!errors.username}
            />
            {errors.username && (
              <Text className="text-destructive text-xs mt-2 ml-2">
                {errors.username.message}
              </Text>
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
            <AuthInput
              icon="mail-outline"
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
          required: t("auth.signup.errors.passwordRequired"),
          minLength: {
            value: 6,
            message: t("auth.signup.errors.passwordMinLength"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <AuthInput
              icon="lock-closed-outline"
              placeholder={t("auth.signup.password")}
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
            <AuthInput
              icon="lock-closed-outline"
              placeholder={t("auth.signup.confirmPassword")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              editable={!loading}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <Text className="text-destructive text-xs mt-2 ml-2">
                {errors.confirmPassword.message}
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
            <Ionicons name="person-add-outline" size={22} color="#0b3d2e" />
            <Text className="text-[#0b3d2e] text-base font-bold tracking-wider">
              {t("auth.signup.createAccount").toUpperCase()}
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
