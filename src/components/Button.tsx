import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "success" | "danger" | "secondary" | "warning";
};

export default function Button({
  title,
  onPress,
  loading = false,
  variant = "primary",
}: Props) {
  const bgColor =
    variant === "success"
      ? COLORS.success
      : variant === "danger"
        ? COLORS.danger
        : variant === "warning"
          ? COLORS.warning
          : variant === "secondary"
            ? COLORS.muted
            : COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
