<script setup lang="ts">
import { useReportUtils } from '@/composables/useReportUtils';
import { categoryEnum } from '@/types/Report';

const { getIconType } = useReportUtils();

const props = defineProps<{
  reportIcon: categoryEnum
  reportName: string
  reportDesc: string
}>()



</script>

<template>

  <div class="w-80 flex flex-col px-4 py-4 my-4 shadow-[4px_6px_18px_#BEBEBE] rounded-lg gap-4">
    <div class="flex flex-row gap-4">
      <div class="flex w-[30px] h-[30px] items-center justify-center my-auto">
        <component :is="getIconType(props.reportIcon)" alt="report icon"/> 
      </div>
      <h2 class="text-lg font-semibold">{{ $t(reportName) }}</h2>
    </div>
    
    <div class="flex flex-col">
      <p>{{ $t(reportDesc) }}</p>
    </div>
  </div>
  
</template>