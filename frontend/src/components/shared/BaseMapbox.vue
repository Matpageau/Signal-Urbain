<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from "mapbox-gl"

const mapContainer = ref<HTMLDivElement | null>(null)
let map: mapboxgl.Map | null = (null)

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

onUnmounted(() => {
  map?.remove()
})
</script>

<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
  />
</template>