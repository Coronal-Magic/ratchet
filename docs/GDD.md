# Ratchet — Game Design Document

## Overview

**Ratchet** is a web-based third-person battleground shooter where up to 4 players — playing as dwarfs and gnomes — fight in free-for-all matches. Capture nodes, loot crates, scavenge turret parts, and fortify your positions to dominate the battlefield.

**Art Style:** Clean cel-shaded/toon (Shell Shockers meets Wind Waker). Bold outlines, bright colors, simple readable shapes. Characters are short, chunky, and hilarious.

**Inspiration:** Ratchet & Clank: Up Your Arsenal (Siege mode), Conker's Bad Fur Day multiplayer, Shell Shockers.

---

## Game Modes

### Node Control
- 5 capture nodes spread across the map
- Stand on a node to capture it (contested if multiple players present)
- Holding nodes earns points over time (1 point/sec per node)
- Match timer: 5 minutes
- Most points when timer expires wins

### Last Standing
- Each player has 3 lives
- Last player alive wins
- Nodes and turrets still active (strategic advantage, not scoring)
- No time limit

---

## Characters

Free-for-all — pick your look, no team mechanics.

### Dwarfs
- Stocky, wide, big beards
- Variants: Miner, Blacksmith, Berserker (cosmetic only)

### Gnomes
- Short, pointy hats, mischievous
- Variants: Tinkerer, Alchemist, Scout (cosmetic only)

All characters have identical base stats. Differences are cosmetic only.

---

## Core Mechanics

### Movement & Combat
- Third-person camera (over-the-shoulder)
- WASD movement, mouse aim/shoot
- Jump, dodge roll (short cooldown)
- Health: 100 HP, regenerates slowly out of combat (5 HP/sec after 5s)

### Capture Nodes
- 5 nodes placed at strategic map locations
- Stand within node radius to capture (3 second channel)
- Capture is contested if enemy is also in radius
- Captured nodes glow with owner's color
- Nodes can be recaptured by enemies

### Crates
- Spawn at fixed points around the map, respawn every 30 seconds
- Break open to get a random item/upgrade
- Visual indicator when a crate has respawned

### Turret Building
Scattered across the map are 4 turret parts:
1. **Base** — the platform
2. **Barrel** — the weapon
3. **Power Cell** — energy source
4. **Targeting Module** — auto-aim system

- Parts spawn at random locations, respawn 60s after pickup
- Collect all 4 to unlock turret building
- Place a turret on any node you own (interact with node)
- Turret auto-fires at enemies within range
- Turrets have 200 HP and can be destroyed
- One turret per node max
- Losing a node does NOT destroy your turret (enemy must destroy it or capture overrides after 10s)

---

## Weapons

### Default
- **Pickaxe** — Melee, 25 damage, fast swing

### Found in Crates
- **Blunderbuss** — Short range, 40 damage, spread shot, slow reload
- **Crossbow** — Long range, 35 damage, slow fire rate, precise
- **Bomb Toss** — Arc projectile, 50 damage in area, 3 second fuse
- **Wrench Launcher** — Medium range, 20 damage, rapid fire, bounces off walls

### Upgrades
Weapons found in crates replace your current weapon. You carry 1 weapon at a time + pickaxe.

---

## Items (from Crates)

- **Speed Boots** — 30% move speed for 15s
- **Shield Potion** — 50 bonus shield HP (doesn't regenerate)
- **Damage Buff** — 25% damage increase for 20s
- **Health Pack** — Instant 50 HP heal
- **Invisibility Cloak** — Invisible for 8s (breaks on attack)

---

## Map: The Quarry

Medium-sized arena with varied terrain:
- **Center** — Elevated platform with Node 3 (king of the hill)
- **North** — Mine tunnels, tight corridors (Nodes 1 & 2)
- **South** — Open field with scattered rocks (Nodes 4 & 5)
- **East** — Bridge over a chasm, high ground advantage
- **West** — Dense mushroom forest, limited visibility
- Crate spawn points: 12 locations
- Turret part spawn points: 8 locations (parts cycle through them)

---

## HUD

- Health bar + shield bar
- Current weapon icon + ammo
- Minimap with node ownership colors
- Turret parts inventory (4 slots, filled/empty)
- Score/lives display
- Kill feed
- Match timer (Node Control mode)

---

## Tech Stack

- **Client:** TypeScript, Three.js, Vite
- **Server:** Node.js, Colyseus
- **Physics:** Rapier3D (WASM)
- **Networking:** WebSocket via Colyseus
- **Art:** Procedural cel-shaded geometry + outline post-processing

---

## Milestones

### v0.1 — Prototype
- [ ] Basic third-person character controller
- [ ] Simple box map with 3 nodes
- [ ] Multiplayer connection (2-4 players in a room)
- [ ] Node capture mechanic
- [ ] Basic shooting (pickaxe + 1 ranged weapon)
- [ ] Cel-shaded rendering with outlines

### v0.2 — Core Loop
- [ ] All weapons implemented
- [ ] Crate spawning and looting
- [ ] Turret part collection and building
- [ ] Both game modes functional
- [ ] Basic HUD

### v0.3 — Polish
- [ ] Full map: The Quarry
- [ ] Character models (dwarf + gnome variants)
- [ ] Sound effects and music
- [ ] Lobby/matchmaking UI
- [ ] Game over screen with stats
