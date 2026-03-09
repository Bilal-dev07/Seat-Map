# Interactive Event Seating Map + User Data API

## Project Overview

This project implements an **interactive arena seating map** and a **high-performance user data API** as part of a full-stack engineering assignment.

The frontend renders a scalable event seating layout where users can:

- Select up to **8 seats**
- View **seat details and pricing**
- Toggle a **price-tier heat map**
- Navigate the seating map using **mouse, keyboard, and zoom controls**

The backend provides a **high-performance Express.js API** featuring caching, rate limiting, and asynchronous request handling.

---

# Features

### Frontend

- Interactive SVG-based seating map (~3,600 seats)
- Seat selection with **max 8 seats**
- **Keyboard accessibility** and ARIA labels
- **Zoom / pan controls**
- **Price-tier heat map**
- Persistent seat selection via **localStorage**

### Backend

- **LRU in-memory caching**
- **Request coalescing** for concurrent requests
- **Token-bucket rate limiting**
- Background **cache invalidation**
- Cache statistics endpoint

---

# Architecture & Design Decisions

## Frontend — Interactive Seating Map

The seating map uses a **procedurally generated venue layout** arranged in a horseshoe arena pattern around a central stage.

Key design decisions:

- **SVG rendering** instead of Canvas
  SVG provides native DOM interactivity (focus, ARIA, keyboard navigation) without implementing a custom event system.

- **React performance optimizations**
  - `React.memo` prevents unnecessary component re-renders
  - `useCallback` stabilizes event handlers
  - Seat selection uses `Set<string>` for **O(1)** lookup performance.

- **Stage-centered layout**
  Seats are arranged using **polar coordinates**, creating a realistic horseshoe arena around a central stage.

- **Heat map mode**
  Users can toggle between **seat status colors** and **price-tier visualization**.

---

## Backend — Express.js User Data API

The API focuses on **high performance and concurrency handling**.

### LRU Cache

- Implemented using `Map` (insertion order preserved)
- **O(1)** lookup and eviction
- Cache entries expire after **60 seconds**
- Background job clears stale entries every **10 seconds**

### Request Coalescing

Concurrent requests for the same user ID share a **single simulated database request**, preventing redundant operations.

### Rate Limiting

A **token-bucket rate limiter** allows:

- Sustained traffic: **10 requests/minute**
- Burst capacity: **5 requests within 10 seconds**

Rate limits are applied per client.

---

# Trade-offs

- **Venue layout generation**
  The seating map is generated procedurally for flexibility. A production system would load venue data from an external API or database.

- **In-memory backend storage**
  The backend uses in-memory structures for simplicity. A production system would use **Redis or a database-backed cache**.

---

# Running the Project

## Frontend

```bash
pnpm install
pnpm dev
```

Application runs at:

```
http://localhost:8080
```

---

## Backend

```bash
cd backend
pnpm install
pnpm dev
```

API runs at:

```
http://localhost:3001
```

---

# API Endpoints

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/users/:id`    | Fetch user by ID (cached) |
| POST   | `/users`        | Create a new user         |
| DELETE | `/cache`        | Clear entire cache        |
| GET    | `/cache-status` | Retrieve cache metrics    |

---

# Tests

Run frontend unit tests:

```bash
pnpm test
```

---

# TODO / Future Improvements

- WebSocket seat status updates
- Pinch-zoom and touch gestures for mobile
- Playwright end-to-end tests
- Redis-backed distributed cache
- Prometheus monitoring for API metrics

---

# Author

- Bilal Ahmed
- Senior Software Engineer — AI & Full Stack Systems
