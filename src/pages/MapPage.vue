<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppShell from '@/app/AppShell.vue'
import WorldMap from '@/components/map/WorldMap.vue'
import CountryPanel from '@/components/map/CountryPanel.vue'
import MapControls from '@/components/map/MapControls.vue'
import { useCountries } from '@/composables/useCountries'
import gdp from '@/data/countries/gdp-snapshot.json'

const { byNumeric } = useCountries()

const mapRef = ref<InstanceType<typeof WorldMap> | null>(null)
const selectedNumeric = ref<string | null>(null)

const selectedCountry = computed(() =>
  selectedNumeric.value ? byNumeric.value.get(selectedNumeric.value) ?? null : null,
)

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') selectedNumeric.value = null
}

onMounted(() => window.addEventListener('keydown', onEscape))
onUnmounted(() => window.removeEventListener('keydown', onEscape))
</script>

<template>
  <AppShell page-title="World Map">
    <div class="map-page">
      <WorldMap
        ref="mapRef"
        :by-numeric="byNumeric"
        :selected-id="selectedNumeric"
        class="map-area"
        :class="{ 'panel-open': !!selectedCountry }"
        @select="selectedNumeric = $event"
      />

      <CountryPanel
        :country="selectedCountry"
        :gdp="gdp"
        @close="selectedNumeric = null"
      />

      <div class="controls-overlay">
        <MapControls
          @zoom-in="mapRef?.zoomIn()"
          @zoom-out="mapRef?.zoomOut()"
          @reset="mapRef?.resetView()"
        />
      </div>
    </div>
  </AppShell>
</template>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 52px - 40px);
  overflow: hidden;
  background: #0d1a2e;
}

.map-area {
  width: 100%;
  height: 100%;
  transition: width 0.25s ease;
}

.map-area.panel-open {
  width: calc(100% - 300px);
}

.controls-overlay {
  position: absolute;
  bottom: 20px;
  left: 16px;
  z-index: 5;
}

</style>
