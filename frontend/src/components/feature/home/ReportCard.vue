<script setup lang="ts">
import type { ReportData, statusEnum, typeEnum } from '@/types/Report';
import axios from 'axios';

const props = defineProps<{
  report: ReportData
}>()

const getRingColor = (status: statusEnum, nbUpvote: number) => {
  if(status == 'created') {
    if(nbUpvote < 250) {
      return 'border-neutral-500'
    }
    else if(nbUpvote < 500) {
      return 'border-red-900'
    }
    else if(nbUpvote < 1000) {
      return 'border-red-700'
    }
    else {
      return 'border-red-500'
    }
  }
  else if(status == 'in_progress') {
    return 'border-yellow-500'
  }
  else if(status == 'resolved') {
    return 'border-(--blue)'
  }
}

const getType = (type: typeEnum) => {
  switch (type) {
    case 'pothole':
      return "Pothole"

    case 'dmgelement':
      return "Dammaged element"

    case 'roadobstacle':
      return "Road obstacle"

    case 'faultylight':
      return "Faulty trafic light"

    case 'dangeroustree':
      return "Dangerous tree"

    case 'other':
      return "Other"  

    default:
      return "Other"
  }
}

const getNeighborhood = async (long: number, lat: number) => {
  const resGeo = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&types=neighborhood&limit=1&worldview=us&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
  const feature = resGeo.data.features[0]

  return feature.properties.feature_type
}
</script>

<template>
  <div class="flex flex-col w-full h-fit">
    <div class="flex">
      <div :class="[getRingColor(props.report.status, props.report.upvote), 'flex justify-center items-center border-4']">
        <img src="" alt="" class="">
      </div>
      <div>
        <h2>{{ getType(props.report.type) }}</h2>
        <p>{{ await getNeighborhood(props.report.long, props.report.lat) }}</p>
      </div>
    </div>
  </div>
</template>