import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DecksSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export default function DecksSearchBar({
  value,
  onChangeText,
  placeholder,
}: DecksSearchBarProps) {
  return (
    <View className="px-6 py-3">
      <View
        className="flex-row items-center bg-card rounded-2xl px-4 py-3 border-2 border-border"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 0,
          elevation: 6,
        }}
      >
        <Ionicons name="search" size={20} color="#6e9e8a" />
        <TextInput
          className="flex-1 ml-3 text-foreground text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6e9e8a"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Ionicons name="close-circle" size={20} color="#6e9e8a" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
