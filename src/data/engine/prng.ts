/** mulberry32 — fast seeded PRNG returning floats in [0, 1) */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return function (): number {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** FNV-1a 32-bit hash of a string → deterministic u32 seed */
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

/** Box-Muller: two uniform draws → one standard normal */
export function stdNormal(rand: () => number): number {
  let u1: number, u2: number
  do { u1 = rand() } while (u1 === 0)
  u2 = rand()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}
