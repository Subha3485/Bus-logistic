import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { fetchBuses, fetchShipments } from "../lib/api";

export default function OperatorScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<
    Array<{ trackingId: string; currentStatus: string; destination: string }>
  >([]);
  const [busCount, setBusCount] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [shipmentData, busData] = await Promise.all([fetchShipments(), fetchBuses()]);
        setShipments(shipmentData);
        setBusCount(busData.filter((bus) => bus.liveStatus === "en_route").length);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const delayedCount = shipments.filter((shipment) => shipment.currentStatus === "delayed").length;
  const queue = shipments.slice(0, 3).map((shipment) => `${shipment.trackingId} heading to ${shipment.destination} (${shipment.currentStatus})`);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Operator Dashboard</Text>
      <Text style={styles.subtitle}>Cargo intake, routing, and dispatch visibility.</Text>

      {loading ? <ActivityIndicator size="large" color="#f97316" /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.metricsRow}>
        {[
          { label: "Active Shipments", value: String(shipments.length) },
          { label: "Buses En Route", value: String(busCount) },
          { label: "Delayed Parcels", value: String(delayedCount) }
        ].map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s queue</Text>
        {queue.length === 0 && !loading ? <Text style={styles.emptyText}>No live shipments available.</Text> : null}
        {queue.map((item) => (
          <View key={item} style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20
  },
  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 12
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14
  },
  metricsRow: {
    gap: 12
  },
  metricCard: {
    backgroundColor: "#172554",
    borderRadius: 18,
    padding: 18
  },
  metricValue: {
    color: "#e0f2fe",
    fontSize: 28,
    fontWeight: "800"
  },
  metricLabel: {
    color: "#bfdbfe",
    fontSize: 13,
    marginTop: 4
  },
  section: {
    gap: 10
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700"
  },
  listItem: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14
  },
  listText: {
    color: "#e2e8f0",
    lineHeight: 20
  }
});
