# 🪓 Ratchet — Dwarfs & Gnomes Battleground

A web-based third-person multiplayer shooter where stubby dwarfs and sneaky gnomes battle for node supremacy.

## Quick Start

```bash
pnpm install
pnpm dev
```

Client: http://localhost:5173  
Server: ws://localhost:2567

## Game

- **Up to 4 players** in free-for-all matches
- **Capture nodes** to earn points or survive with 3 lives
- **Loot crates** for weapons and power-ups
- **Scavenge turret parts** and build defenses on your nodes
- **Cel-shaded art** — bold, colorful, and hilarious

See [Game Design Document](docs/GDD.md) for full details.

## Tech Stack

| Layer | Tech |
|-------|------|
| Rendering | Three.js + cel-shading |
| Server | Colyseus (Node.js) |
| Physics | Rapier3D (WASM) |
| Language | TypeScript |
| Build | Vite + pnpm workspaces |

## Project Structure

```
packages/
  client/    → Three.js game client (Vite)
  server/    → Colyseus multiplayer server
  shared/    → Shared types, constants, messages
```

## License

MIT
