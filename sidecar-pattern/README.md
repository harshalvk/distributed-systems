# sidecar pattern

a metrics sidecar that observes an app's HTTP logs and exposes request-count metrics — without the app knowing the sidecar exists.

## the idea

the sidecar pattern attaches a secondary container to a primary one to extend its behavior, without touching the primary's code. the two containers share:

- a **volume** (how they communicate here)
- a **network namespace** (in k8s — a single pod; here, a shared Docker network)

if this is working correctly, you could delete the sidecar entirely and the main app wouldn't notice.

## what's in this folder

```
sidecar-pattern/
├── main-app/         # the "primary" — an Express app with two routes
│   ├── src/
│   │   ├── index.ts
│   │   └── lib/logger.ts
│   └── Dockerfile
├── sidecar/          # tails main-app's logs, exposes /metrics
│   ├── index.ts
│   ├── lib/lib.ts    # tailFile — byte-offset file tailing
│   └── Dockerfile
├── shared/           # the only "coupling" between the two — a path + parser contract
│   ├── path.ts
│   └── parser.ts
└── docker-compose.yml
```

## how it works

1. **main-app** logs every request (`timestamp method path status`) to `/var/log/app/access.log` via an Express middleware hooked into `res.on("finish")` — so the status code is captured only after it's finalized.
2. **sidecar** tails that file from a byte offset (no re-reading old data), parses each new line, and keeps an in-memory tally of request counts by status code.
3. both containers mount the **same named Docker volume** at `/var/log/app` — that shared mount is the entire coupling between them. no API calls, no shared code beyond a path constant and a line-parsing function.
4. sidecar exposes the tally over `GET /metrics`.

## design decisions worth knowing

- **absolute, container-structure-independent path** (`/var/log/app`) for the log file — this lets both services mount the same path even though their working directories inside the container differ (`/app/main-app` vs `/app/sidecar`).
- **sidecar starts tailing from current EOF**, not file start — a sidecar that restarts independently shouldn't replay all of history.
- **retry-until-exists on startup** — `docker-compose`'s `depends_on` only controls container *start order*, not readiness. the sidecar polls for the log file to exist rather than assuming main-app has created it yet.
- **multi-stage Dockerfiles** — dependency install is cached in its own layer, separate from source copy, so editing app code doesn't force a full `bun install` on every rebuild.

## running it

```bash
docker compose up --build
```

then, from another terminal:

```bash
curl http://localhost:8080/          # 200
curl http://localhost:8080/fail      # 500
curl http://localhost:9090/metrics   # { "entries": { "200": 1, "500": 1 } }
```

## what this exercise actually teaches

the mechanism matters more than the metrics endpoint itself:

- cross-cutting concerns (logging, metrics, service-mesh proxies) can be bolted onto a primary container as a separately deployed, separately versioned unit
- coordination through shared infrastructure (a volume, a namespace) instead of shared code is a deliberate architectural choice, not a shortcut
- `res.on("finish")`, byte-offset file tailing, and retry-on-not-ready are all patterns that show up far beyond this one exercise

## book reference

*Designing Distributed Systems* by Brendan Burns — Chapter 2, Sidecar Pattern.