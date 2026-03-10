export type UserRole = "customer" | "operator" | "driver" | "admin";

export type ShipmentStatus =
  | "created"
  | "received"
  | "loaded"
  | "in_transit"
  | "arrived_hub"
  | "out_for_delivery"
  | "delivered"
  | "delayed";

export interface LocationPoint {
  stopCode: string;
  stopName: string;
  city: string;
  latitude?: number;
  longitude?: number;
  updatedAt: string;
}

export interface Bus {
  id: string;
  registrationNumber: string;
  routeId: string;
  driverId: string;
  liveStatus: "idle" | "boarding_cargo" | "en_route" | "arrived";
}

export interface RouteStop {
  id: string;
  code: string;
  name: string;
  city: string;
  order: number;
  etaOffsetMinutes: number;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  stops: RouteStop[];
}

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  note: string;
  location: LocationPoint;
  createdAt: string;
  actorName: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  packageType: string;
  weightKg: number;
  price: number;
  origin: string;
  destination: string;
  routeId: string;
  busId?: string;
  currentStatus: ShipmentStatus;
  currentLocation: LocationPoint;
  eta: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentWithTimeline extends Shipment {
  events: ShipmentEvent[];
}

export interface CreateShipmentInput {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  packageType: string;
  weightKg: number;
  price: number;
  origin: string;
  destination: string;
  routeId: string;
}

export interface UpdateShipmentStatusInput {
  status: ShipmentStatus;
  note: string;
  actorName: string;
  location: Omit<LocationPoint, "updatedAt">;
}
