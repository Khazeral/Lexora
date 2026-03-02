import { useEffect, useRef } from "react";
import { View, Text, Modal, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pillShadow } from "./ui/GlowStyles";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
};

const modalConfig = {
  danger: {
    icon: "trash" as const,
    iconColor: "#e8453c",
    iconBg: "#3d1a1a",
    confirmBg: "#e8453c",
    confirmText: "#fff",
    borderColor: "#e8453c",
  },
  warning: {
    icon: "alert-circle" as const,
    iconColor: "#f5c542",
    iconBg: "#3d2e1a",
    confirmBg: "#f5c542",
    confirmText: "#0b3d2e",
    borderColor: "#f5c542",
  },
  info: {
    icon: "information-circle" as const,
    iconColor: "#5b8af5",
    iconBg: "#1a3a5c",
    confirmBg: "#5b8af5",
    confirmText: "#fff",
    borderColor: "#5b8af5",
  },
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  type = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = modalConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          stiffness: 350,
          damping: 25,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <Animated.View
          style={[
            {
              width: "100%",
              backgroundColor: "#134c39",
              borderRadius: 24,
              borderWidth: 2,
              borderColor: "#2a7a60",
              padding: 24,
              alignItems: "center",
              transform: [{ scale }],
              opacity,
            },
            pillShadow.default,
          ]}
        >
          <Pressable>
            {/* Icon */}
            <View
              style={[
                {
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: config.iconBg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  borderWidth: 2,
                  borderColor: config.iconColor,
                  alignSelf: "center",
                },
                pillShadow.sm,
              ]}
            >
              <Ionicons name={config.icon} size={32} color={config.iconColor} />
            </View>

            {/* Title */}
            <Text
              style={{
                color: "#e8edf5",
                fontSize: 20,
                fontWeight: "900",
                letterSpacing: 2,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {title.toUpperCase()}
            </Text>

            {/* Message */}
            <Text
              style={{
                color: "#90c0ac",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 20,
                marginBottom: 28,
              }}
            >
              {message}
            </Text>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                width: "100%",
              }}
            >
              <Pressable
                onPress={onCancel}
                style={[
                  {
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: "#0c3429",
                    borderWidth: 2,
                    borderColor: "#2a7a60",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  pillShadow.sm,
                ]}
              >
                <Text
                  style={{
                    color: "#90c0ac",
                    fontSize: 14,
                    fontWeight: "700",
                    letterSpacing: 1.5,
                  }}
                >
                  {cancelText.toUpperCase()}
                </Text>
              </Pressable>

              <Pressable
                onPress={onConfirm}
                style={[
                  {
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: config.confirmBg,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  pillShadow.sm,
                ]}
              >
                <Text
                  style={{
                    color: config.confirmText,
                    fontSize: 14,
                    fontWeight: "700",
                    letterSpacing: 1.5,
                  }}
                >
                  {confirmText.toUpperCase()}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
