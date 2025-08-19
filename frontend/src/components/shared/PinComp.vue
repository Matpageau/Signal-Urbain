<script setup lang="ts">
import type { statusEnum, categoryEnum, ReportData } from '@/types/Report'
import PotholeIcon from '../icons/type/PotholeIcon.vue';
import BrokenWallIcon from '../icons/type/BrokenWallIcon.vue';
import RoadObstacleIcon from '../icons/type/RoadObstavleIcon.vue';
import TrafficIcon from '../icons/type/TrafficIcon.vue';
import TreeIcon from '../icons/type/TreeIcon.vue';
import OtherIcon from '../icons/type/OtherIcon.vue';
import { computed, ref } from 'vue';
import type { PinData } from '@/types/Pin';
import UpvoteIcon from '../icons/UpvoteIcon.vue';

const props = defineProps<{
  report?: ReportData
  pinData?: PinData
  canHover?: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

const showHovered = ref(false)

const effectiveCategory = computed<categoryEnum | undefined>(() => {
  return props.report?.category ?? props.pinData?.category
})
const effectiveStatus = computed<statusEnum | undefined>(() => {
  return props.report?.status ?? props.pinData?.status
})
const effectiveUpvote = computed<number | undefined>(() => {
  return props.report?.upvote ?? props.pinData?.upvote
})

const getIconType = (category?: categoryEnum) => {
  switch (category) {
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
  <div
    @mouseenter="showHovered = true"
    @mouseleave="showHovered = false"
  >
    <div 
      v-if="showHovered && canHover"
      class="absolute flex flex-col bg-white w-[135px] h-[110px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg p-2"
    > 
      <img :src="props.report?.media[0]" alt="report image" class="rounded-lg shrink-0 h-[75px] cursor-pointer" @click="emit('select')">
      <div class="flex items-center justify-end shrink-0">
        <p>{{ effectiveUpvote }}</p>
        <UpvoteIcon class="ml-1 cursor-pointer"/>
      </div>
    </div>
    <div :class="[getRingColor(effectiveStatus, effectiveUpvote), 'flex justify-center items-center border-4 rounded-full h-[30px] w-[30px] bg-white p-0.5']">
      <component :is="getIconType(effectiveCategory)" class="rounded-full" />
    </div>
  </div>
</template>
