<script setup lang="ts">
import { createApp, h, onMounted, onUnmounted, ref, watch } from 'vue';

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from "mapbox-gl"
import type { ReportData } from '@/types/Report';
import PinComp from './PinComp.vue';

const props = defineProps<{
  reports: ReportData[]
}>()

const emit = defineEmits<{
  (e: 'select', report: ReportData): void
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: mapboxgl.Map | null = (null)
let markers: mapboxgl.Marker[] = []

function renderMarkers(reports: ReportData[]) {
  if (!map) return

  // supprimer les anciens
  markers.forEach(m => m.remove())
  markers = []

  // recréer les nouveaux
  reports.forEach(report => {
    if (!map) return
    const el = document.createElement('div')

    createApp({
      render: () =>
        h(PinComp, {
          report: report,
          canHover: true,
          onSelect: () => emit('select', report)
        }),
    }).mount(el)

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([report.long, report.lat])
      .addTo(map)

    markers.push(marker)
  })
}

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords

      if(!mapContainer.value) return

      map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/standard?optimize=true',
        center: [longitude, latitude],
        zoom: 2,
        attributionControl: false,
        pitchWithRotate: false,
        dragRotate: false
      })
    
      map.addControl(new mapboxgl.NavigationControl({
        showZoom: false
      }))

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: false,
        fitBoundsOptions: {maxZoom: 12}
      })

      map.addControl(geolocate)

      map.on('load', () => {
        renderMarkers(props.reports)
        geolocate.trigger()
      })
    },
    (err) => {
      console.error('Erreur localisation :', err)

      if(!mapContainer.value) return

      map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/standard?optimize=true',
        center: [0, 0],
        zoom: 2,
        attributionControl: false,
        pitchWithRotate: false,
        dragRotate: false
      })
    }
  )
})

watch(() => props.reports, (newReports) => {
    renderMarkers(newReports)
  },
  { deep: true }
)

onUnmounted(() => {
  markers.forEach(m => m.remove())
  map?.remove()
})
</script>

<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
  />
</template>