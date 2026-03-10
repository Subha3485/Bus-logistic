# Architecture

## Roles

- `customer`: track shipment status with tracking ID
- `operator`: create shipments, assign routes, manage exceptions
- `driver`: update checkpoints, loading, handoff, and delivery
- `admin`: audit network activity, users, and performance

## Domain model

- `shipment`: parcel record and current state
- `shipment_event`: immutable tracking timeline entry
- `route`: bus cargo corridor with ordered stops
- `bus`: vehicle assigned to a route and driver
- `assignment`: connection between shipment, route, and bus

## Mobile app modules

- Home launcher for customer, operator, and driver flows
- Tracking detail flow for customers
- Operator dashboard for cargo control
- Driver console for stop progression

Recommended next mobile modules:

- Auth and session management
- Shipment creation and barcode scanning
- Driver stop confirmation with camera and GPS
- Push notifications for status changes

## API modules

- `GET /health`
- `GET /shipments`
- `GET /shipments/:trackingId`
- `POST /shipments`
- `POST /shipments/:trackingId/status`
- `GET /transport/routes`
- `GET /transport/buses`

Recommended next backend modules:

- JWT auth with role-based guards
- PostgreSQL persistence with Prisma
- Audit log and exception handling
- ETA engine from route schedule and live bus position
- Notification service for SMS and WhatsApp

## Production deployment shape

- Android app built with Expo EAS or React Native native pipeline
- API deployed behind Nginx or a cloud load balancer
- PostgreSQL for core operations
- Redis for queues, sessions, and event fan-out
- Object storage for invoices, proof-of-delivery, and labels

## Scaling path

1. Move from seeded data to PostgreSQL models.
2. Add auth, role permissions, and operator activity logging.
3. Add QR/barcode scan workflow for shipment handoffs.
4. Add live bus GPS ingestion and route-based ETA calculation.
5. Add customer notifications and analytics dashboards.
