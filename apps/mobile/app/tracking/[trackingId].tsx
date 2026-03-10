import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { type ShipmentWithTimeline } from "@bus-logistics/shared";

import { fetchShipmentByTrackingId } from "../../lib/api";

export default function TrackingDetailsScreen() {
  const { trackingId } = useLocalSearchParams<{ trackingId: string }>();
  const [shipment, setShipment] = useState<ShipmentWithTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingId) {
      setError("Tracking ID is missing");
      setLoading(false);
      return;
    }

    async function loadShipment() {
      try {
        const result = await fetchShipmentByTrackingId(trackingId);
        setShipment(result);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load shipment");
      } finally {
        setLoading(false);
      }
    }

    loadShipment();
  }, [trackingId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tracking ID</Text>
      <Text style={styles.value}>{trackingId}</Text>

      {loading ? <ActivityIndicator size="large" color="#14b8a6" /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {shipment ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryStatus}>{formatStatus(shipment.currentStatus)}</Text>
          <Text style={styles.summaryText}>
            Current location: {shipment.currentLocation.stopName}, {shipment.currentLocation.city}
          </Text>
          <Text style={styles.summaryText}>ETA: {formatDate(shipment.eta)}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipment timeline</Text>
        {shipment?.events.map((item) => (
          <View key={item.id} style={styles.eventCard}>
            <Text style={styles.eventStatus}>{formatStatus(item.status)}</Text>
            <Text style={styles.eventLocation}>
              {item.location.stopName}, {item.location.city}
            </Text>
            <Text style={styles.eventNote}>{item.note}</Text>
            <Text style={styles.eventTime}>{formatDate(item.createdAt)}</Text>
          </View>
        ))}
        {!loading && !shipment?.events.length ? <Text style={styles.emptyText}>No tracking events available.</Text> : null}
      </View>
    </ScrollView>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (value) => value.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 18
  },
  label: {
    color: "#f97316",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginTop: 12
  },
  value: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800"
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14
  },
  summaryCard: {
    backgroundColor: "#0f766e",
    borderRadius: 18,
    padding: 18,
    gap: 6
  },
  summaryStatus: {
    color: "#ecfeff",
    fontSize: 26,
    fontWeight: "800"
  },
  summaryText: {
    color: "#ccfbf1",
    fontSize: 14
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700"
  },
  eventCard: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4
  },
  eventStatus: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700"
  },
  eventLocation: {
    color: "#cbd5e1",
    fontSize: 14
  },
  eventNote: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 19
  },
  eventTime: {
    color: "#67e8f9",
    fontSize: 12
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14
  }
});
