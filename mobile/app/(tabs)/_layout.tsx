import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#0c3429",
          borderTopColor: "#0c3429",
          borderRadius: 16,
          height: 90,
          paddingHorizontal: 16,
          paddingBottom: 90,
        },
        tabBarItemStyle: {
          flex: 1,
          height: 90,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon="home"
              label={t("tabs.home")}
              isFocused={pathname === "/"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="deck"
        options={{
          title: t("tabs.decks"),
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon="albums"
              label={t("tabs.decks")}
              isFocused={pathname === "/deck"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: t("tabs.train"),
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon="barbell"
              label={t("tabs.train")}
              isFocused={pathname === "/train"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon="person"
              label={t("tabs.profile")}
              isFocused={pathname === "/profile"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

type TabButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isFocused: boolean;
  onPress?: ((e: any) => void) | null;
  onLongPress?: ((e: any) => void) | null;
  style?: any;
  [key: string]: any;
};

function TabButton({
  icon,
  label,
  isFocused,
  onPress,
  onLongPress,
  style,
}: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        style,
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {isFocused ? (
        <View
          style={{
            width: 76,
            height: 70,
            borderRadius: 16,
            backgroundColor: "#e74c3c",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Ionicons name={icon} size={24} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Text>
        </View>
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 4 }}
        >
          <Ionicons name={icon} size={24} color="#6e9e8a" />
          <Text
            style={{
              color: "#6e9e8a",
              fontSize: 11,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
