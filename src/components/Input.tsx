import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { COLORS } from "../../constants/theme";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
}: Props) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.textarea]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  textarea: {
    minHeight: 110,
  },
});
