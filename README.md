# Distributed Systems Patterns

hands-on implementations of the patterns from *Designing Distributed Systems* by Brendan Burns.

reading the book alone doesn't stick. this repo is me building each pattern from scratch — small, runnable, over-engineered where it matters, under-engineered everywhere else — to actually understand what's happening instead of just recognizing the diagram.

each pattern lives in its own folder with its own README covering the design, the containers/services involved, and how to run it.

## patterns

### single-node patterns (composition around one app)

| pattern | status | description |
|---|---|---|
| [sidecar](./sidecar-pattern) | ✅ done | metrics sidecar tailing a shared log file, zero coupling to the main app |
| ambassador | 🔜 next | outbound proxy handling retries/circuit-breaking so the app doesn't have to |
| adapter | 🔜 planned | normalizes a "legacy" component's output into a standard interface |

### multi-node / cluster patterns (distributed state and coordination)

| pattern | status | description |
|---|---|---|
| replicated load-balanced service | 🔜 planned | stateless replicas behind a Service, self-healing |
| sharded service | 🔜 planned | partitioned keyspace across pods, routed by shard key |
| scatter/gather | 🔜 planned | fan-out to multiple leaf services, aggregate with partial-result handling |
| work queue | 🔜 planned | producer/queue/worker-pool pattern |
| leader election | 🔜 planned | using k8s Lease API for single-leader coordination |
| functions/events | 🔜 planned | event-triggered short-lived workloads |

## stack

- **phase 1 (single-node):** TypeScript + Bun, Docker Compose
- **phase 2 (multi-node):** Go, Kubernetes (kind/minikube)

## why

builder in public, learner in public. each folder is meant to be readable end-to-end by someone else trying to learn the same pattern — not just a working demo, but the reasoning behind every design decision.

more patterns added as I work through the book.