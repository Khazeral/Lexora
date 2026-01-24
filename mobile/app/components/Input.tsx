import { TextInput, StyleSheet, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  placeholder: string;
  error?: boolean;
};

export default function Input({
  placeholder,
  error,
  style,
  multiline,
  ...props
}: InputProps) {
  return (
    <TextInput
      style={[
        styles.input,
        error && styles.inputError,
        multiline && styles.multiline,
        style,
      ]}
      placeholder={placeholder}
      multiline={multiline}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1e293b",
  },
  inputError: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
