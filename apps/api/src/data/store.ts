import {
  type Bus,
  type Route,
  type Shipment,
  type ShipmentEvent,
  type ShipmentStatus,
  type ShipmentWithTimeline,
} from "@bus-logistics/shared";

const now = new Date();

export const routes: Route[] = [
  {
    id: "route_blr_che",
    name: "Bangalore to Chennai Express Cargo",
    origin: "Bangalore",
    destination: "Chennai",
    stops: [
      { id: "stop_1", code: "BLR", name: "Majestic Cargo Hub", city: "Bangalore", order: 1, etaOffsetMinutes: 0 },
      { id: "stop_2", code: "KRM", name: "Krishnagiri Junction", city: "Krishnagiri", order: 2, etaOffsetMinutes: 120 },
      { id: "stop_3", code: "VLP", name: "Vellore Yard", city: "Vellore", order: 3, etaOffsetMinutes: 240 },
      { id: "stop_4", code: "CHE", name: "Koyambedu Cargo Point", city: "Chennai", order: 4, etaOffsetMinutes: 360 }
    ]
  }
];

export const buses: Bus[] = [
  {
    id: "bus_001",
    registrationNumber: "KA01AB4321",
    routeId: "route_blr_che",
    driverId: "driver_001",
    liveStatus: "en_route"
  }
];

const shipmentOneId = "shipment_001";

export const shipmentEvents: ShipmentEvent[] = [
  {
    id: "event_001",
    shipmentId: shipmentOneId,
    status: "received",
    note: "Parcel received at origin hub",
    actorName: "Ravi Ops",
    createdAt: new Date(now.getTime() - 1000 * 60 * 210).toISOString(),
    location: {
      stopCode: "BLR",
      stopName: "Majestic Cargo Hub",
      city: "Bangalore",
      updatedAt: new Date(now.getTime() - 1000 * 60 * 210).toISOString()
    }
  },
  {
    id: "event_002",
    shipmentId: shipmentOneId,
    status: "loaded",
    note: "Loaded on scheduled bus",
    actorName: "Ravi Ops",
    createdAt: new Date(now.getTime() - 1000 * 60 * 160).toISOString(),
    location: {
      stopCode: "BLR",
      stopName: "Majestic Cargo Hub",
      city: "Bangalore",
      updatedAt: new Date(now.getTime() - 1000 * 60 * 160).toISOString()
    }
  },
  {
    id: "event_003",
    shipmentId: shipmentOneId,
    status: "in_transit",
    note: "Departed Bangalore hub",
    actorName: "Mohan Driver",
    createdAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
    location: {
      stopCode: "KRM",
      stopName: "Krishnagiri Junction",
      city: "Krishnagiri",
      updatedAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString()
    }
  }
];

export const shipments: Shipment[] = [
  {
    id: shipmentOneId,
    trackingId: "BUS-2026-0001",
    senderName: "Anand Traders",
    senderPhone: "+919900000001",
    receiverName: "Siva Stores",
    receiverPhone: "+919900000002",
    packageType: "Electronics carton",
    weightKg: 24,
    price: 1800,
    origin: "Bangalore",
    destination: "Chennai",
    routeId: "route_blr_che",
    busId: "bus_001",
    currentStatus: "in_transit",
    currentLocation: {
      stopCode: "KRM",
      stopName: "Krishnagiri Junction",
      city: "Krishnagiri",
      updatedAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString()
    },
    eta: new Date(now.getTime() + 1000 * 60 * 150).toISOString(),
    createdAt: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString()
  }
];

export function listShipments(): Shipment[] {
  return shipments;
}

export function getShipmentByTrackingId(trackingId: string): ShipmentWithTimeline | undefined {
  const shipment = shipments.find((item) => item.trackingId.toLowerCase() === trackingId.toLowerCase());

  if (!shipment) {
    return undefined;
  }

  return {
    ...shipment,
    events: shipmentEvents
      .filter((event) => event.shipmentId === shipment.id)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  };
}

export function addShipment(shipment: Shipment): Shipment {
  shipments.unshift(shipment);
  return shipment;
}

export function addShipmentEvent(event: ShipmentEvent): ShipmentEvent {
  shipmentEvents.push(event);
  return event;
}

export function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  location: Shipment["currentLocation"]
): Shipment | undefined {
  const shipment = shipments.find((item) => item.id === shipmentId);

  if (!shipment) {
    return undefined;
  }

  shipment.currentStatus = status;
  shipment.currentLocation = location;
  shipment.updatedAt = new Date().toISOString();

  return shipment;
}
