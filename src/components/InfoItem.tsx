import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

type Props = {
  label: string;
  value?: string | number | null;
};

export default function InfoItem({ label, value }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
  },
  value: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 3,
  },
});
