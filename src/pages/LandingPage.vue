<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cardsRef = ref<HTMLElement | null>(null)
const activeCard = ref(0)

function enter() {
  router.push('/portfolio')
}

function scrollToCard(index: number) {
  const el = cardsRef.value
  if (!el) return
  const cardWidth = el.scrollWidth / 3
  el.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
}

function onCardsScroll() {
  const el = cardsRef.value
  if (!el) return
  const cardWidth = el.scrollWidth / 3
  activeCard.value = Math.round(el.scrollLeft / cardWidth)
}
</script>

<template>
  <div class="landing">
    <div class="landing-content">
      <div class="badge" aria-hidden="true">
        <span class="badge-dot" />
        LIVE SIMULATED DATA
      </div>

      <div class="hero">
        <img src="/navbar-pic.svg" alt="DataViz" class="hero-logo" />
        <h1 class="hero-title">DataViz</h1>
        <p class="hero-tagline">Professional market data, beautifully visualized</p>
      </div>

      <!-- Desktop: grid / Mobile: carousel -->
      <div class="cards-wrapper">
        <div class="cards" ref="cardsRef" @scroll.passive="onCardsScroll">
          <div class="card" role="listitem">
            <div class="card-visual" aria-hidden="true">
              <svg viewBox="0 0 240 110" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="55" r="28" fill="none" stroke="#1E2736" stroke-width="10"/>
                <circle cx="60" cy="55" r="28" fill="none" stroke="#F5B800" stroke-width="10" stroke-dasharray="52 124" stroke-dashoffset="-10"/>
                <circle cx="60" cy="55" r="28" fill="none" stroke="#3B82F6" stroke-width="10" stroke-dasharray="38 124" stroke-dashoffset="-62"/>
                <circle cx="60" cy="55" r="28" fill="none" stroke="#22C55E" stroke-width="10" stroke-dasharray="34 124" stroke-dashoffset="-100"/>
                <rect x="104" y="22" width="8" height="8" rx="2" fill="#F5B800"/>
                <text x="118" y="30" fill="#E6EAF2" font-size="8" font-family="monospace">AAPL  38%</text>
                <rect x="104" y="38" width="8" height="8" rx="2" fill="#3B82F6"/>
                <text x="118" y="46" fill="#E6EAF2" font-size="8" font-family="monospace">MSFT  27%</text>
                <rect x="104" y="54" width="8" height="8" rx="2" fill="#22C55E"/>
                <text x="118" y="62" fill="#E6EAF2" font-size="8" font-family="monospace">NVDA  25%</text>
                <rect x="104" y="70" width="8" height="8" rx="2" fill="#8B5CF6"/>
                <text x="118" y="78" fill="#E6EAF2" font-size="8" font-family="monospace">AMZN  10%</text>
                <text x="60" y="52" fill="#8B96A9" font-size="6" text-anchor="middle" font-family="monospace">TOTAL</text>
                <text x="60" y="62" fill="#E6EAF2" font-size="9" font-weight="bold" text-anchor="middle" font-family="monospace">$42.8K</text>
              </svg>
            </div>
            <div class="card-body">
              <h2 class="card-title">Portfolio</h2>
              <p class="card-desc">Track your holdings allocation and performance in real time.</p>
            </div>
          </div>

          <div class="card" role="listitem">
            <div class="card-visual" aria-hidden="true">
              <svg viewBox="0 0 240 110" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="40" x2="230" y2="40" stroke="#1E2736" stroke-width="0.5"/>
                <line x1="10" y1="65" x2="230" y2="65" stroke="#1E2736" stroke-width="0.5"/>
                <line x1="10" y1="90" x2="230" y2="90" stroke="#1E2736" stroke-width="0.5"/>
                <polygon points="10,80 30,70 50,75 70,55 90,60 110,45 130,50 150,38 170,42 190,30 210,35 230,22 230,100 10,100" fill="#F5B800" opacity="0.06"/>
                <polyline points="10,80 30,70 50,75 70,55 90,60 110,45 130,50 150,38 170,42 190,30 210,35 230,22" fill="none" stroke="#F5B800" stroke-width="1.5"/>
                <text x="12" y="20" fill="#8B96A9" font-size="7" font-family="monospace">AAPL</text>
                <text x="12" y="30" fill="#E6EAF2" font-size="9" font-weight="bold" font-family="monospace">$198.42</text>
                <text x="80" y="20" fill="#22C55E" font-size="7" font-family="monospace">+1.84%</text>
              </svg>
            </div>
            <div class="card-body">
              <h2 class="card-title">Equities</h2>
              <p class="card-desc">Follow major stock indices with live ticks and historical charts.</p>
            </div>
          </div>

          <div class="card" role="listitem">
            <div class="card-visual card-visual--map" aria-hidden="true">
              <img src="/landing-map.png" alt="" class="card-map-img" />
            </div>
            <div class="card-body">
              <h2 class="card-title">World Map</h2>
              <p class="card-desc">Interactive world map with economic data for every country.</p>
            </div>
          </div>
        </div>

        <!-- Mobile carousel dots -->
        <div class="carousel-dots" aria-hidden="true">
          <span class="dot" :class="{ active: activeCard === 0 }" @click="scrollToCard(0)" />
          <span class="dot" :class="{ active: activeCard === 1 }" @click="scrollToCard(1)" />
          <span class="dot" :class="{ active: activeCard === 2 }" @click="scrollToCard(2)" />
        </div>
      </div>

      <button class="cta" @click="enter">
        Enter Dashboard
        <span class="cta-arrow" aria-hidden="true">→</span>
      </button>

      <p class="footer-note">Simulated data for demonstration purposes only.</p>
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100dvh;
  background: #0A0E14;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.landing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  width: 100%;
  max-width: 900px;
  animation: fade-in 0.4s ease both;
}

/* Badge */
.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.08em;
  color: #8B96A9;
  border: 1px solid #1E2736;
  border-radius: 20px;
  padding: 5px 14px;
  animation: slide-down 0.4s ease 0.2s both;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22C55E;
  animation: pulse 2s ease-in-out infinite;
}

/* Hero */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  animation: scale-up 0.5s ease 0.4s both;
}

.hero-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: #E6EAF2;
  letter-spacing: -0.02em;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.hero-tagline {
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  color: #8B96A9;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  animation: fade-in 0.5s ease 0.9s both;
}

.card {
  background: #141B28;
  border: 1px solid #1E2736;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: #F5B800;
  transform: translateY(-2px);
}

.card-visual {
  background: #0F1520;
  width: 100%;
  overflow: hidden;
}

.card-visual svg {
  width: 100%;
  height: auto;
  display: block;
}

.card-body {
  padding: 14px 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #E6EAF2;
  margin: 0 0 4px;
  font-family: 'Inter', sans-serif;
}

.card-visual--map {
  overflow: hidden;
  height: 110px;
}

.card-map-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  object-position: center 30%;
  display: block;
  margin-top: -10px;
}

.card-desc {
  font-size: 12px;
  color: #8B96A9;
  margin: 0;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

/* CTA */
.cta {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F5B800;
  color: #0A0E14;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  border: none;
  border-radius: 6px;
  padding: 12px 28px;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  animation: fade-up 0.4s ease 1.4s both;
}

.cta:hover {
  background: #ffc61a;
  transform: translateY(-1px);
}

.cta:active {
  transform: translateY(0);
}

.cta-arrow {
  font-size: 18px;
  transition: transform 0.15s;
}

.cta:hover .cta-arrow {
  transform: translateX(3px);
}

/* Footer */
.footer-note {
  font-size: 11px;
  color: #5B667A;
  margin: 0;
  font-family: 'Inter', sans-serif;
  animation: fade-in 0.4s ease 1.6s both;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Carousel dots (hidden on desktop) */
.carousel-dots {
  display: none;
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1E2736;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.dot.active {
  background: #F5B800;
  transform: scale(1.2);
}

/* Mobile */
@media (max-width: 640px) {
  .landing-content {
    gap: 2rem;
  }

  .cards-wrapper {
    width: 100%;
  }

  .cards {
    display: flex;
    grid-template-columns: unset;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 12px;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  .cards::-webkit-scrollbar {
    display: none;
  }

  .card {
    flex: 0 0 80vw;
    scroll-snap-align: center;
  }

  .carousel-dots {
    display: flex;
  }
}
</style>
