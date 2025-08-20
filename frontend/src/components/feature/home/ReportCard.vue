<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CommentIcon from '@/components/icons/CommentIcon.vue';
import UpvoteIcon from '@/components/icons/UpvoteIcon.vue';
import PinComp from '@/components/shared/PinComp.vue';
import { useReportStore } from '@/stores/reportStore';
import type { ReportData } from '@/types/Report';
import { getNeighborhood, getType } from '@/utils/reportUtils';

const reportStore = useReportStore()

const props = defineProps<{
  report: ReportData
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const neighborhood = ref<string>("Loading...")

onMounted(async () => {
  neighborhood.value = await getNeighborhood(props.report.long, props.report.lat)
})
</script>

<template>
  <div class="flex flex-col w-full h-fit bg-white rounded-lg p-4">
    <div class="flex items-center cursor-pointer w-fit" @click="emit('click')">
      <PinComp :report="props.report"/>
      <div class="ml-1">
        <h1 class="font-bold leading-none">{{ getType(props.report.category) }}</h1>
        <p class="leading-none text-xs">{{ neighborhood }}</p>
      </div>
    </div>
    <img :src="props.report.medias[0]" alt="report image" class="my-3 cursor-pointer" @click="emit('click')">
    <div class="flex justify-between">
      <div class="flex">
        <CommentIcon class="mr-4"/>
        <!-- <p>{{ props.report.comments.length }}</p> -->
      </div>
      <div class="flex">
        <p>{{ props.report.upvote }}</p>
        <UpvoteIcon class="ml-4 cursor-pointer" @click="reportStore.upvoteReport(props.report._id)"/>
      </div>
    </div>
  </div>
</template>