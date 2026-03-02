import { useEffect, useRef } from "react";
import { Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pillShadow } from "./GlowStyles";

type ToastProps = {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onDismiss: () => void;
  duration?: number;
};

const toastConfig = {
  success: {
    icon: "checkmark-circle" as const,
    iconColor: "#44d9a0",
    borderColor: "#44d9a0",
    bgColor: "#1a3d2e",
  },
  error: {
    icon: "close-circle" as const,
    iconColor: "#e8453c",
    borderColor: "#e8453c",
    bgColor: "#3d1a1a",
  },
  info: {
    icon: "information-circle" as const,
    iconColor: "#5b8af5",
    borderColor: "#5b8af5",
    bgColor: "#1a3a5c",
  },
};

export default function Toast({
  visible,
  message,
  type = "success",
  onDismiss,
  duration = 2000,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = toastConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          stiffness: 300,
          damping: 25,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 60,
          left: 24,
          right: 24,
          zIndex: 9999,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={dismiss}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: config.bgColor,
            borderWidth: 2,
            borderColor: config.borderColor,
          },
          pillShadow.default,
        ]}
      >
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
        <Text
          style={{
            flex: 1,
            color: "#e8edf5",
            fontSize: 15,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
