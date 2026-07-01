import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/theme";

export default function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },
});
