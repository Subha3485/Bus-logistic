import { type Bus, type Route, type Shipment, type ShipmentWithTimeline } from "@bus-logistics/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:4000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getApiUrl() {
  return API_URL;
}

export function fetchShipments() {
  return request<Shipment[]>("/shipments");
}

export function fetchShipmentByTrackingId(trackingId: string) {
  return request<ShipmentWithTimeline>(`/shipments/${trackingId}`);
}

export function fetchRoutes() {
  return request<Route[]>("/transport/routes");
}

export function fetchBuses() {
  return request<Bus[]>("/transport/buses");
}
