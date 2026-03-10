import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health.js";
import { shipmentRouter } from "./routes/shipments.js";
import { transportRouter } from "./routes/routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      name: "Bus Logistics API",
      version: "0.1.0",
      docs: {
        health: "/health",
        shipments: "/shipments",
        routes: "/transport/routes",
        buses: "/transport/buses"
      }
    });
  });

  app.use("/health", healthRouter);
  app.use("/shipments", shipmentRouter);
  app.use("/transport", transportRouter);

  return app;
}
