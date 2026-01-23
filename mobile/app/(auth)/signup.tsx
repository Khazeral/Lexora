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

const Header = () => (
  <>
    <Text style={styles.title}>Flashcard Pro</Text>
    <Text style={styles.subtitle}>Create an account to get started</Text>
  </>
);

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
}: SignupFormProps) => (
  <View style={styles.form}>
    <Controller
      control={control}
      name="username"
      rules={{
        required: "Username is required",
        minLength: {
          value: 3,
          message: "Username must be at least 3 characters",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <Input
            placeholder="Username"
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
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <Input
            placeholder="Email"
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
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <Input
            placeholder="Password"
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
        required: "Please confirm your password",
        validate: (value) => value === password || "Passwords do not match",
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View>
          <Input
            placeholder="Confirm Password"
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
      title="Create Account"
      onPress={onSubmit}
      loading={loading}
      disabled={loading}
    />
  </View>
);

const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Already have an account? </Text>
    <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
      <Text style={styles.linkText}>Sign In</Text>
    </TouchableOpacity>
  </View>
);

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
