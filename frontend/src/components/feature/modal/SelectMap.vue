<script setup lang="ts">
import { createApp, h, onMounted, onUnmounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PinComp from '@/components/shared/PinComp.vue';
import type { PinData } from '@/types/Pin';
import type { ReportData } from '@/types/Report';

const mapContainer = ref<HTMLDivElement | null>(null);
let map: mapboxgl.Map | null = null;
let marker: mapboxgl.Marker | null = null;

const props = defineProps<{
  coord?: [number, number];
  report?: ReportData
  pinData?: PinData
  canMove: boolean
}>()

const emit = defineEmits<{
  (e: 'select', coord: [number, number]): void
}>()

const pinRef = ref<PinData | undefined>(props.report)

watch(() => props.report, (newPin) => {
  pinRef.value = newPin;
});


const setMarker = (coords: [number, number]) => {
  if (!map) return;
  
  if(!marker) {
    const el = document.createElement('div')
    
    createApp({
      render: () => h(PinComp, { report: props.report, pinData: { category: props.pinData?.category, status: props.pinData?.status, upvote: props.pinData?.upvote } })
    }).mount(el)

    marker = new mapboxgl.Marker({ element: el })
      .setLngLat(coords)
      .addTo(map);
  }
  else {
    marker.setLngLat(coords);
  }
  map.flyTo({ center: coords });
  emit('select', coords);
}

watch(() => props.coord, (newCoord) => {
  if (newCoord) setMarker(newCoord);
});

onMounted(() => {
  if (!mapContainer.value) return;
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;

  const center: [number, number] = props.coord || [0, 0];
  const zoom = props.coord ? 12 : 9;

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/standard?optimize=true',
    center,
    zoom,
    attributionControl: false,
    pitchWithRotate: false,
    dragRotate: false
  });

  map.addControl(new mapboxgl.NavigationControl({ showZoom: false }));

  if (props.coord) {
    setMarker(props.coord);
  }

  if(props.canMove == true) {
    map.on('click', (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setMarker(coords);
    });
  }

  if (!props.coord && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const userCoords: [number, number] = [longitude, latitude];
        map?.setCenter(userCoords);
      },
      (err) => console.warn('Géolocalisation impossible', err)
    );
  }
});

onUnmounted(() => {
  map?.remove();
});
</script>

<template>
  <div ref="mapContainer" class="w-full h-full" />
</template>
