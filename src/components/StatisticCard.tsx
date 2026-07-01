import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  value: string | number;
  icon?: string;
};

export default function StatisticCard({ title, value, icon = "📊" }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 4,
    marginBottom: 12,
  },
  icon: {
    fontSize: 22,
    marginBottom: 8,
  },
  title: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
});
