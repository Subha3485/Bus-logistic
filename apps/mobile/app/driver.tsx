import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { fetchBuses, fetchRoutes } from "../lib/api";

export default function DriverScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busNumber, setBusNumber] = useState("Unavailable");
  const [routeName, setRouteName] = useState("No route loaded");
  const [stops, setStops] = useState<Array<{ name: string; status: string; time: string }>>([]);

  useEffect(() => {
    async function loadDriverView() {
      try {
        const [buses, routes] = await Promise.all([fetchBuses(), fetchRoutes()]);
        const currentBus = buses[0];
        const route = routes.find((item) => item.id === currentBus?.routeId);

        if (currentBus) {
          setBusNumber(currentBus.registrationNumber);
        }

        if (route) {
          setRouteName(route.name);
          setStops(
            route.stops.map((stop, index) => ({
              name: stop.name,
              status: index === 0 ? "Completed" : index === 1 ? "Current" : "Upcoming",
              time: `${String(Math.floor(stop.etaOffsetMinutes / 60) + 8).padStart(2, "0")}:${String(stop.etaOffsetMinutes % 60).padStart(2, "0")}`
            }))
          );
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load route data");
      } finally {
        setLoading(false);
      }
    }

    loadDriverView();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Driver Console</Text>
      <Text style={styles.subtitle}>Checkpoint updates and parcel handoff tracking.</Text>
      {loading ? <ActivityIndicator size="large" color="#84cc16" /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Current Bus</Text>
        <Text style={styles.heroValue}>{busNumber}</Text>
        <Text style={styles.heroSubtext}>Route: {routeName}</Text>
      </View>

      <View style={styles.timeline}>
        {stops.length === 0 && !loading ? <Text style={styles.emptyText}>No stop data available.</Text> : null}
        {stops.map((stop) => (
          <View key={stop.name} style={styles.stopCard}>
            <Text style={styles.stopName}>{stop.name}</Text>
            <Text style={styles.stopMeta}>{stop.status}</Text>
            <Text style={styles.stopMeta}>{stop.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 18
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
  hero: {
    backgroundColor: "#3f6212",
    borderRadius: 20,
    padding: 18,
    gap: 6
  },
  heroLabel: {
    color: "#d9f99d",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2
  },
  heroValue: {
    color: "#f7fee7",
    fontSize: 30,
    fontWeight: "800"
  },
  heroSubtext: {
    color: "#ecfccb",
    fontSize: 14
  },
  timeline: {
    gap: 10
  },
  stopCard: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4
  },
  stopName: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700"
  },
  stopMeta: {
    color: "#cbd5e1",
    fontSize: 13
  }
});
