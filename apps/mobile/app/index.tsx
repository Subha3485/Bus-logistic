import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getApiUrl } from "../lib/api";

const cards = [
  {
    title: "Track Shipment",
    description: "Customer flow to check parcel status with tracking ID.",
    href: "/tracking/BUS-2026-0001"
  },
  {
    title: "Operator Dashboard",
    description: "Manage cargo intake, route assignment, and exceptions.",
    href: "/operator"
  },
  {
    title: "Driver Console",
    description: "Update checkpoint scans and delivery progress on route.",
    href: "/driver"
  }
] as const;

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>Bus Goods Logistics</Text>
      <Text style={styles.title}>Android-first cargo operations for bus networks.</Text>
      <Text style={styles.subtitle}>
        This app is designed for parcel movement, route assignment, and live shipment tracking. It is not for passenger seat booking.
      </Text>
      <Text style={styles.apiText}>API: {getApiUrl()}</Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <Link key={card.title} href={card.href} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 18
  },
  eyebrow: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 24
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24
  },
  apiText: {
    color: "#38bdf8",
    fontSize: 13
  },
  grid: {
    gap: 14,
    marginTop: 12
  },
  card: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 8
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 19,
    fontWeight: "700"
  },
  cardDescription: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20
  }
});
