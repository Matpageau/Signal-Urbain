<script setup lang="ts">
import CommentIcon from '@/components/icons/CommentIcon.vue';
import UpvoteIcon from '@/components/icons/UpvoteIcon.vue';
import PinComp from '@/components/shared/PinComp.vue';
import type { ReportData } from '@/types/Report';
import { getNeighborhood, getType } from '@/utils/reportUtils';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  report: ReportData
}>()

const neighborhood = ref<string>("Loading...")

onMounted(async () => {
  neighborhood.value = await getNeighborhood(props.report.long, props.report.lat)
})
</script>

<template>
  <div class="flex flex-col w-full h-fit">
    <div class="flex">
      <PinComp :report="props.report"/>
      <div>
        <h1 class="font-bold text-2xl">{{ getType(props.report.type) }}</h1>
        <p>{{ neighborhood }}</p>
      </div>
    </div>
    <img :src="props.report.media[0]" alt="report image">
    <div class="flex justify-between">
      <div class="flex">
        <CommentIcon class="mr-4"/>
        <p>{{ props.report.comments.length }}</p>
      </div>
      <div class="flex">
        <p>{{ props.report.upvote }}</p>
        <UpvoteIcon class="ml-4"/>
      </div>
    </div>
  </div>
</template>