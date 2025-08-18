<script setup lang="ts">
import type { statusEnum, typeEnum } from '@/types/Report'
import PotholeIcon from '../icons/type/PotholeIcon.vue';
import BrokenWallIcon from '../icons/type/BrokenWallIcon.vue';
import RoadObstacleIcon from '../icons/type/RoadObstavleIcon.vue';
import TrafficIcon from '../icons/type/TrafficIcon.vue';
import TreeIcon from '../icons/type/TreeIcon.vue';
import OtherIcon from '../icons/type/OtherIcon.vue';
import type { PinData } from '@/types/Pin';

const props = defineProps<{
  pin?: PinData
}>()

const getIconType = (type?: typeEnum) => {
  switch (type) {
    case 'pothole':
      return PotholeIcon
    case 'dmgelement':
      return BrokenWallIcon
    case 'roadobstacle':
      return RoadObstacleIcon
    case 'faultylight':
      return TrafficIcon
    case 'dangeroustree':
      return TreeIcon
    case 'other':
    default:
      return OtherIcon 
  }
}

const getRingColor = (status?: statusEnum, nbUpvote?: number) => {
  if (status == 'created') {
    if ((nbUpvote ?? 0) < 250) return 'border-neutral-500'
    else if (nbUpvote ?? 0 < 500) return 'border-red-900'
    else if (nbUpvote ?? 0 < 1000) return 'border-red-700'
    else return 'border-red-500'
  } 
  else if (status == 'in_progress') {
    return 'border-yellow-500'
  } 
  else if (status == 'resolved') {
    return 'border-(--blue)'
  }
  return 'border-neutral-500'
}
</script>

<template>
  <div :class="[getRingColor(props?.pin?.status, props?.pin?.upvote), 'flex justify-center items-center border-4 rounded-full h-[30px] w-[30px] bg-white p-0.5']">
    <component :is="getIconType(props?.pin?.type)" class="rounded-full" />
  </div>
</template>
