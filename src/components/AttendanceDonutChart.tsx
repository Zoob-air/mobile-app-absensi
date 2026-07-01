import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type Props = {
  hadir: number;
  belumHadir: number;
  persentase: number | string;
};

export default function AttendanceDonutChart({
  hadir,
  belumHadir,
  persentase,
}: Props) {
  const chartData = [
    {
      value: hadir || 0,
      color: "#16a34a",
      text: "Hadir",
    },
    {
      value: belumHadir || 0,
      color: "#dc2626",
      text: "Belum",
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Statistik Kehadiran</Text>

      <View style={styles.chartWrapper}>
        <PieChart
          data={chartData}
          donut
          radius={90}
          innerRadius={60}
          showText={false}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.percent}>{persentase}%</Text>
              <Text style={styles.centerText}>Hadir</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.legendRow}>
        <Legend color="#16a34a" label="Hadir" value={hadir} />
        <Legend color="#dc2626" label="Belum Hadir" value={belumHadir} />
      </View>
    </View>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>
        {label}: {value}
      </Text>
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
  chartWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  centerLabel: {
    alignItems: "center",
  },
  percent: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },
  centerText: {
    color: "#64748b",
    fontSize: 12,
  },
  legendRow: {
    marginTop: 15,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#334155",
    fontWeight: "600",
  },
});
