<script setup lang="ts">
import type { statusEnum, categoryEnum, ReportData } from '@/types/Report'
import PotholeIcon from '../icons/type/PotholeIcon.vue';
import BrokenWallIcon from '../icons/type/BrokenWallIcon.vue';
import RoadObstacleIcon from '../icons/type/RoadObstavleIcon.vue';
import TrafficIcon from '../icons/type/TrafficIcon.vue';
import TreeIcon from '../icons/type/TreeIcon.vue';
import VandalismIcon from '../icons/type/VandalismIcon.vue';
import OtherIcon from '../icons/type/OtherIcon.vue';
import { computed, ref } from 'vue';
import type { PinData } from '@/types/Pin';
import UpvoteIcon from '../icons/UpvoteIcon.vue';
import { useReportStore } from '@/stores/reportStore';
import { useReportUtils } from '@/composables/useReportUtils';
import { useUserStore } from '@/stores/userStore';
import { UserRoleEnum } from '@/types/User';

const { getStatus } = useReportUtils()

const userStore = useUserStore()
const reportStore = useReportStore()

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
  return props.report?.upvote_user_ids.length ?? props.pinData?.upvote
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
    case 'vandalism':
      return VandalismIcon
    case 'other':
    default:
      return OtherIcon 
  }
}

const getRingColor = (status?: statusEnum, nbUpvote?: number) => { 
  if (status == 'created') {
    if ((nbUpvote ?? 0) < 250) return 'border-neutral-500'
    else if ((nbUpvote ?? 0) < 500 ) return 'border-[#4a0000]'
    else if ((nbUpvote ?? 0) < 1000) return 'border-[#a10000]'
    else return 'border-[#ff0000]'
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
      v-if="showHovered && canHover && props.report"
      class="absolute flex flex-col bg-white w-[135px] h-[110px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg p-2 z-50"
    > 
      <img :src="props.report.medias[0]" alt="report image" class="rounded-lg shrink-0 h-[75px] cursor-pointer object-cover" @click="emit('select')">
      <div class="flex justify-between items-center">
        <p>{{ getStatus(effectiveStatus) }}</p>
        <div class="flex items-center justify-end shrink-0">
          <p>{{ effectiveUpvote }}</p>
          <UpvoteIcon 
            :class="['ml-1', { 'fill-red-500 stroke-red-800': reportStore.reports.find(r => r._id == props.report?._id)?.upvote_user_ids.includes(userStore.currentUser?._id ?? '')}, {'cursor-pointer': userStore.currentUser?.role == UserRoleEnum.USER}]" 
            @click="reportStore.upvoteReport(props.report._id)"
          />
        </div>
      </div>
    </div>
    <div :class="[getRingColor(effectiveStatus, effectiveUpvote), 'flex justify-center items-center border-2 lg:border-4 rounded-full h-[21px] lg:h-[30px] w-[21px] lg:w-[30px] bg-white p-0.5 z-1']">
      <component :is="getIconType(effectiveCategory)" class="rounded-full" />
    </div>
  </div>
</template>