import { Router } from "express";

import { buses, routes } from "../data/store.js";

export const transportRouter = Router();

transportRouter.get("/routes", (_request, response) => {
  response.json(routes);
});

transportRouter.get("/buses", (_request, response) => {
  response.json(buses);
});
