import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
  sudahClockOut: number;
  belumClockOut: number;
};

export default function ClockOutBarChart({
  sudahClockOut,
  belumClockOut,
}: Props) {
  const chartData = [
    {
      value: sudahClockOut || 0,
      label: "Sudah",
      frontColor: "#2563eb",
    },
    {
      value: belumClockOut || 0,
      label: "Belum",
      frontColor: "#f97316",
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Clock Out</Text>

      <BarChart
        data={chartData}
        barWidth={42}
        spacing={45}
        roundedTop
        roundedBottom
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={4}
        maxValue={Math.max(sudahClockOut, belumClockOut, 1)}
        isAnimated
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
});
