import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { type CreateShipmentInput, type Shipment, type UpdateShipmentStatusInput } from "@bus-logistics/shared";

import { addShipment, addShipmentEvent, getShipmentByTrackingId, listShipments, updateShipmentStatus } from "../data/store.js";

const createShipmentSchema = z.object({
  senderName: z.string().min(2),
  senderPhone: z.string().min(8),
  receiverName: z.string().min(2),
  receiverPhone: z.string().min(8),
  packageType: z.string().min(2),
  weightKg: z.number().positive(),
  price: z.number().nonnegative(),
  origin: z.string().min(2),
  destination: z.string().min(2),
  routeId: z.string().min(2)
}) satisfies z.ZodType<CreateShipmentInput>;

const updateStatusSchema = z.object({
  status: z.enum([
    "created",
    "received",
    "loaded",
    "in_transit",
    "arrived_hub",
    "out_for_delivery",
    "delivered",
    "delayed"
  ]),
  note: z.string().min(2),
  actorName: z.string().min(2),
  location: z.object({
    stopCode: z.string().min(2),
    stopName: z.string().min(2),
    city: z.string().min(2),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
}) satisfies z.ZodType<UpdateShipmentStatusInput>;

export const shipmentRouter = Router();

shipmentRouter.get("/", (_request, response) => {
  response.json(listShipments());
});

shipmentRouter.get("/:trackingId", (request, response) => {
  const shipment = getShipmentByTrackingId(request.params.trackingId);

  if (!shipment) {
    response.status(404).json({ message: "Shipment not found" });
    return;
  }

  response.json(shipment);
});

shipmentRouter.post("/", (request, response) => {
  const parsed = createShipmentSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ message: "Invalid shipment payload", issues: parsed.error.issues });
    return;
  }

  const input = parsed.data;
  const timestamp = new Date().toISOString();
  const shipmentId = uuidv4();
  const trackingId = `BUS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const shipment: Shipment = {
    id: shipmentId,
    trackingId,
    senderName: input.senderName,
    senderPhone: input.senderPhone,
    receiverName: input.receiverName,
    receiverPhone: input.receiverPhone,
    packageType: input.packageType,
    weightKg: input.weightKg,
    price: input.price,
    origin: input.origin,
    destination: input.destination,
    routeId: input.routeId,
    currentStatus: "created",
    currentLocation: {
      stopCode: input.origin.slice(0, 3).toUpperCase(),
      stopName: `${input.origin} Cargo Hub`,
      city: input.origin,
      updatedAt: timestamp
    },
    eta: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  addShipment(shipment);
  addShipmentEvent({
    id: uuidv4(),
    shipmentId,
    status: "created",
    note: "Shipment created by operator",
    actorName: "System",
    createdAt: timestamp,
    location: shipment.currentLocation
  });

  response.status(201).json(shipment);
});

shipmentRouter.post("/:trackingId/status", (request, response) => {
  const shipment = getShipmentByTrackingId(request.params.trackingId);

  if (!shipment) {
    response.status(404).json({ message: "Shipment not found" });
    return;
  }

  const parsed = updateStatusSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ message: "Invalid status payload", issues: parsed.error.issues });
    return;
  }

  const input = parsed.data;
  const location = {
    ...input.location,
    updatedAt: new Date().toISOString()
  };

  const updated = updateShipmentStatus(shipment.id, input.status, location);

  if (!updated) {
    response.status(404).json({ message: "Shipment not found" });
    return;
  }

  addShipmentEvent({
    id: uuidv4(),
    shipmentId: shipment.id,
    status: input.status,
    note: input.note,
    actorName: input.actorName,
    createdAt: new Date().toISOString(),
    location
  });

  response.json(updated);
});
