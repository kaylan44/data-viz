<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { zoom as d3zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom'
import { select } from 'd3-selection'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { RestCountry } from '@/data/countries/restCountriesClient'
import worldData from 'world-atlas/countries-110m.json'

const props = defineProps<{
  byNumeric: ReadonlyMap<string, RestCountry>
  selectedId: string | null   // ccn3
}>()

const emit = defineEmits<{
  select: [ccn3: string | null]
  ready: []
}>()

const WIDTH = 960
const HEIGHT = 500

const svgEl = ref<SVGSVGElement | null>(null)
const paths = ref<{ id: string; d: string; hasData: boolean }[]>([])
const transform = ref<ZoomTransform>(zoomIdentity)

let zoomBehavior: ReturnType<typeof d3zoom> | null = null

const projection = geoNaturalEarth1()
  .scale(153)
  .translate([WIDTH / 2, HEIGHT / 2])

const pathGen = geoPath(projection)

onMounted(() => {
  const world = worldData as unknown as Topology<{ countries: GeometryCollection }>

  const geojson = feature(world, world.objects.countries)

  paths.value = geojson.features.map((f) => {
    const id = String((f as any).id).padStart(3, '0')
    const d = pathGen(f) ?? ''
    return { id, d, hasData: props.byNumeric.has(id) }
  })

  // Set up zoom
  const svg = select(svgEl.value!)
  zoomBehavior = d3zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 8])
    .on('zoom', (event) => {
      transform.value = event.transform
    })
  svg.call(zoomBehavior)

  emit('ready')
})

watch(() => props.byNumeric, () => {
  paths.value = paths.value.map((p) => ({ ...p, hasData: props.byNumeric.has(p.id) }))
})

const gTransform = computed(() => {
  const t = transform.value
  return `translate(${t.x},${t.y}) scale(${t.k})`
})

function handleClick(event: MouseEvent, id: string) {
  event.stopPropagation()
  emit('select', id === props.selectedId ? null : id)
}

function handleSeaClick() {
  emit('select', null)
}

export function zoomIn() {
  if (!zoomBehavior || !svgEl.value) return
  select(svgEl.value).transition().duration(300).call(zoomBehavior.scaleBy, 1.5)
}

export function zoomOut() {
  if (!zoomBehavior || !svgEl.value) return
  select(svgEl.value).transition().duration(300).call(zoomBehavior.scaleBy, 1 / 1.5)
}

export function resetView() {
  if (!zoomBehavior || !svgEl.value) return
  select(svgEl.value).transition().duration(400).call(zoomBehavior.transform, zoomIdentity)
}

defineExpose({ zoomIn, zoomOut, resetView })
</script>

<template>
  <svg
    ref="svgEl"
    class="world-svg"
    :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
    preserveAspectRatio="xMidYMid meet"
    @click="handleSeaClick"
  >
    <!-- Sea background -->
    <rect width="100%" height="100%" class="sea" />

    <g :transform="gTransform">
      <path
        v-for="p in paths"
        :key="p.id"
        :d="p.d"
        :class="['country', { selected: p.id === selectedId, 'no-data': !p.hasData }]"
        @click="handleClick($event, p.id)"
      />
    </g>
  </svg>
</template>

<style scoped>
.world-svg {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}
.world-svg:active { cursor: grabbing; }

.sea { fill: #0d1a2e; }

.country {
  fill: #1e3a5f;
  stroke: #0a1628;
  stroke-width: 0.4px;
  cursor: pointer;
  transition: fill 0.15s;
  vector-effect: non-scaling-stroke;
}

.country:hover { fill: #2d5a8e; }

.country.selected {
  fill: var(--color-accent);
  stroke: #a07800;
  stroke-width: 1px;
}

.country.no-data {
  fill: #152535;
  opacity: 0.7;
}

.country.no-data:hover { fill: #1e3450; }
</style>
