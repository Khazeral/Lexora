import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0c3429",
          borderTopWidth: 2,
          borderTopColor: "#2a7a60",
          height: 85,
          paddingTop: 8,
          paddingBottom: 20,
          paddingHorizontal: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabItem icon="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="deck"
        options={{
          title: "Decks",
          tabBarIcon: ({ focused }) => (
            <TabItem icon="albums" label="Decks" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: "Train",
          tabBarIcon: ({ focused }) => (
            <TabItem icon="barbell" label="Train" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabItem icon="person" label="Settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

type TabItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
};

function TabItem({ icon, label, focused }: TabItemProps) {
  return (
    <View className="items-center justify-center w-20">
      {focused ? (
        <View
          className="w-16 h-16 rounded-2xl items-center justify-center bg-destructive"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 0,
            elevation: 10,
          }}
        >
          <Ionicons name={icon} size={32} color="#fff" />
        </View>
      ) : (
        <View className="items-center justify-center">
          <Ionicons name={icon} size={24} color="#6e9e8a" />
          <Text className="text-xs mt-1 font-semibold tracking-wide text-muted-foreground">
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}
